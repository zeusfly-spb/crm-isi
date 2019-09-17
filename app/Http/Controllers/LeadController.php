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
}
