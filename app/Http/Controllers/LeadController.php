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
        return response()->json(Lead::with('comments')->get()->toArray());
    }

    public function delete(Request $request)
    {
        return response()->json(['result' => Lead::destroy($request->lead_id), 'id' => $request->lead_id]);
    }

    public function updateStatus(Request $request)
    {
        $lead = Lead::with('comments')->find($request->lead_id);
        $lead->addComment($request->comment, $request->user_id);
        $lead->update(['status' => $request->status]);
        $lead->load('comments');
        return response()->json($lead->toArray());
    }

}
