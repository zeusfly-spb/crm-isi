<?php

namespace App\Http\Controllers;

use App\Subscribe;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SubscribeController extends Controller
{
    public function index(Request $request)
    {
        $base_date = new Carbon($request->date);
        $month = $base_date->month;
        $island_id = $request->island_id;
        $subscribes = Subscribe::with('subscription', 'customer', 'user')
            ->where('island_id', $island_id)
            ->whereMonth('start_date', $month)
            ->get();
        return response()->json($subscribes->toArray());
    }
}
