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
            $user['monthPrizes'] = $user->prizes()->whereYear('created_at', $year)->whereMonth('created_at', $month)->get()->toArray();
            $user['monthForfeits'] = $user->forfeits()->whereYear('created_at', $year)->whereMonth('created_at', $month)->get()->toArray();
            $user['monthSicks'] = $user->sicks()->whereYear('created_at', $year)->whereMonth('created_at', $month)->get()->toArray();
            $user['monthPrepays'] = $user->prepays()->whereYear('created_at', $year)->whereMonth('created_at', $month)->get()->toArray();
        }

        $dealsBuilder = Deal::with('user')->whereMonth('created_at', $month);
        if ($request->island_id) {
            $dealsBuilder = $dealsBuilder->where('island_id', $request->island_id);
        }
        $allDeals = $dealsBuilder->get()->toArray();

        return response()->json(['users' => $users->toArray(), 'dates' => $monthDates, 'allDeals' => $allDeals]);
    }

    public function updateUserRate(Request $request)
    {
        $user = User::find($request->user_id);
        $user->update([$request->field_name => $request->value]);
        return response()->json(['user' => $user->toArray(), 'field_name' => $request->field_name]);
    }

    public function addUserPrize(Request $request)
    {
        $user = User::find($request->user_id);
        return response()->json($user->addPrize($request->amount, $request->comment ?? '')->toArray());
    }

    public function addUserForfeit(Request $request)
    {
        $user = User::find($request->user_id);
        return response()->json($user->addForfeit($request->amount, $request->comment ?? '')->toArray());
    }

    public function addUserSick(Request $request)
    {
        $user = User::find($request->user_id);
        return response()->json($user->addSick($request->amount, $request->comment ?? '')->toArray());
    }

    public function addUserPrepay(Request $request)
    {
        $user = User::find($request->user_id);
        return response()->json($user->addPrepay($request->amount, $request->comment)->toArray());
    }
}
