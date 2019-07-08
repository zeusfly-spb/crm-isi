<?php

namespace App\Http\Controllers;

use App\HandOver;
use Illuminate\Http\Request;

class HandOverController extends Controller
{
    public function index(Request $request)
    {
        $handovers = HandOver::with('user')->whereDate('created_at', $request->date)->get();
        return response()->json($handovers->toArray());
    }
}
