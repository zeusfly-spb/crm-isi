<?php

namespace App\Http\Controllers;

use App\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function save(Request $request)
    {
        $lead = Lead::create($request->all());
        return response()->json($lead->toArray());
    }

    public function index(Request $request)
    {
        return response()->json(Lead::whereDate('created_at', $request->date)->get()->toArray());
    }
}
