<?php

namespace App\Http\Controllers;

use App\Deal;
use App\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SalaryController extends Controller
{
    public function monthData(Request $request)
    {
        $date = new Carbon($request->date);
        $year = $date->year;
        $month = $date->month;
        $startDate = $date->startOfMonth()->toDateString();
        $endDate = $date->endOfMonth()->toDateString();

        $monthDates = [];
        $currentDate = strtotime($startDate);
        while ($currentDate <= strtotime($endDate)) {
            $monthDates[] = date("Y-m-d", $currentDate);
            $currentDate = strtotime("+1 day", $currentDate);
        }

        $queryBuilder = User::with('deals', 'workdays')->where('is_superadmin', false);
        if ($request->island_id) {
            $queryBuilder = $queryBuilder->where('island_id', $request->island_id);
        }

        $users = $queryBuilder->get();
        foreach ($users as &$user) {
            $user['monthDeals'] = $user->deals()->whereYear('created_at', $year)->whereMonth('created_at', $month)->get()->toArray();
            $user['monthWorkdays'] = $user->workdays()->whereYear('date', $year)->whereMonth('date', $month)->get()->toArray();
            $user['dates'] = $monthDates;
        }

        $dealsBuilder = Deal::with('user')->whereMonth('created_at', $month);
        if ($request->island_id) {
            $dealsBuilder = $dealsBuilder->where('island_id', $request->island_id);
        }
        $allDeals = $dealsBuilder->get()->toArray();

        return response()->json(['users' => $users->toArray(), 'dates' => $monthDates, 'allDeals' => $allDeals]);
    }
}
