<?php

namespace App\Http\Controllers;

use App\Lead;
use App\LeadComment;
use App\User;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function save(Request $request)
    {
        $lead = Lead::create($request->all());
        if ($request->comment) {
            $lead->addComment($request->comment, null);
        }
        $lead->load('comments', 'user', 'postpones');
        return response()->json($lead->toArray());
    }

    public function index()
    {
        $leads = Lead::with('comments', 'user', 'postpones')->get()->reverse()->values();
        return response()->json($leads->toArray());
    }

    public function delete(Request $request)
    {
        return response()->json(['result' => Lead::destroy($request->lead_id), 'id' => $request->lead_id]);
    }

    public function updateStatus(Request $request)
    {
        $lead = Lead::find($request->lead_id);
        $lead->update(['status' => $request->status]);
        $lead->addComment($request->comment, $request->user_id);
        $lead->load('comments', 'user', 'postpones');
        return response()->json($lead->toArray());
    }

    public function addComment(Request $request)
    {
        $lead = Lead::find($request->lead_id);
        $lead->addComment($request->text, $request->user_id);
        $lead->load('comments', 'user', 'postpones');
        return response()->json($lead->toArray());
    }

    public function deleteComment(Request $request)
    {
        $comment = LeadComment::find($request->comment_id);
        $lead = Lead::find($comment->lead_id);
        LeadComment::destroy($request->comment_id);
        $lead->load('comments', 'user', 'postpones');
        return response()->json($lead->toArray());
    }

    public function missed(Request $request)
    {
        $lead = Lead::create(['phone' => $request->phone, 'comment' => 'Пропущенный звонок']);
        return response()->json($lead->toArray());
    }

    public function addLead(Request $request)
    {
        $lead = Lead::create([
            'phone' => $request->phone,
            'name' => $request->name,
            'status' => 'process',
            'user_id' => $request->user_id
        ]);
        if ($request->comment) {
            $lead->addComment($request->comment, $request->user_id);
        }
        return response()->json($lead->toArray());
    }

    public function addPostpone(Request $request)
    {
        $lead = Lead::find($request->lead_id);
        $timestamp = $request->date . ' ' . $request->time;
        $lead->addPostpone( $timestamp, $request->user_id);
        $lead->load('comments', 'user', 'postpones');
        return response()->json($lead->toArray());
    }
}
