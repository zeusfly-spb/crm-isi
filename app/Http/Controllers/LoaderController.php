<?php

namespace App\Http\Controllers;

use App\Deal;
use App\Expense;
use App\HandOver;
use App\WorkDay;
use App\Setting;
use Illuminate\Http\Request;

class LoaderController extends Controller
{
    public function loadDailyPage(Request $request)
    {
        $date = $request->date;
        $island_id = $request->island_id;

        $workdaysBuilder = WorkDay::with('user', 'timeBreaks')->whereDate('date', $request->date);
        if ($island_id > 0) {
            $workdaysBuilder = $workdaysBuilder->where('island_id', $island_id);
        }
        $workdays = $workdaysBuilder->get()->toArray();

        $dealsBuilder = Deal::with('user', 'customer', 'action')->whereDate('created_at', $date);
        if ($island_id) {
            $dealsBuilder = $dealsBuilder->where('island_id', $island_id);
        }
        $deals = $dealsBuilder->get()->toArray();

        $expensesBuilder = Expense::with('user', 'island')->whereDate('created_at', $date);
        if ($island_id) {
            $expensesBuilder = $expensesBuilder->where('island_id', $island_id);
        }
        $expenses = $expensesBuilder->get()->toArray();

        $handoversBuilder = HandOver::whereDate('created_at', $request->date);
        if ($request->island_id) {
            $handover = $handoversBuilder->where('island_id', $request->island_id)->first();
            $amount = $handover->amount ?? null;
        } else {
            $handovers = $handoversBuilder->get();
            $amount = $handovers->reduce(function ($carry, $item) {
                return $carry + $item->amount;
            });
        }
        $handoverAmount = $amount;

        return response()->json(['workdays' => $workdays, 'deals' => $deals, 'expenses' => $expenses, 'handover' => $handoverAmount]);
    }

    public function loadSetting()
    {
        $setting = Setting::find(1);
        if ($setting) {
            return response()->json($setting->toArray());
        }
        return response()->json([]);
    }
}
