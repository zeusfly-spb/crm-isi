<?php

namespace App\Http\Controllers;

use App\HandOver;
use Illuminate\Http\Request;

class HandOverController extends Controller
{
    public function index(Request $request)
    {
        $queryBuilder = HandOver::with('user')->whereDate('created_at', $request->date);
        if ($request->island_id) {
            $handover = $queryBuilder->where('island_id', $request->island_id)->first();
            $amount = $handover->amount ?? null;
        } else {
            $handovers = $queryBuilder->get();
            $amount = $handovers->reduce(function ($carry, $item) {
                return $carry + $item->amount;
            });
        }
        return response()->json(['amount' => $amount]);
    }

    public function create(Request $request)
    {
        $handOver = HandOver::create([
            'user_id' => $request->user_id,
            'island_id' => $request->island_id,
            'amount' => $request->amount
        ]);
        $handOver->load('user');
        return response()->json($handOver->toArray());
    }
}
