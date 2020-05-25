<?php

namespace App\Http\Controllers;

use App\Subscribe;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SubscribeController extends Controller
{
    public function index(Request $request)
    {
        $baseDate = new Carbon($request->date);
        $start = $baseDate->startOfMonth()->toDateString();
        $finish = $baseDate->endOfMonth()->toDateString();
        $island_id = $request->island_id;
        $subscribes = Subscribe::with('customer', 'user')
            ->where('island_id', $island_id)
            ->get()
            ->filter(function ($subscribe) use ($start, $finish) {
            return ($subscribe->start_date >= $start && $subscribe->start_date <= $finish) || ($subscribe->finish_date >= $start && $subscribe->finish_date <= $finish);
        });
        return response()->json($subscribes->toArray());
    }

    public function addComment(Request $request)
    {
        $subscribe = Subscribe::with('customer', 'user')->find($request->subscribe_id);
        $subscribe->addComment($request->text, $request->user_id);
        return response()->json($subscribe->toArray());
    }
}
