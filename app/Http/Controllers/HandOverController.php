<?php

namespace App\Http\Controllers;

use App\HandOver;
use Illuminate\Http\Request;

class HandOverController extends Controller
{
    public function index(Request $request)
    {
        $queryBuilder = HandOver::with('user')->whereDate('created_at', $request->date);
        $handovers = $queryBuilder->get();
        return response()->json($handovers->toArray());
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
