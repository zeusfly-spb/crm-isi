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
        return response()->json($lead->toArray());
    }

    public function index()
    {
        $leads = Lead::with('comments')->get()->reverse()->values();
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
        $lead->load('comments');
        return response()->json($lead->toArray());
    }

    public function addComment(Request $request)
    {
        $lead = Lead::find($request->lead_id);
        $lead->addComment($request->text, $request->user_id);
        $lead->load('comments');
        return response()->json($lead->toArray());
    }

    public function deleteComment(Request $request)
    {
        $comment = LeadComment::find($request->comment_id);
        $lead = Lead::find($comment->lead_id);
        LeadComment::destroy($request->comment_id);
        $lead->load('comments');
        return response()->json($lead->toArray());
    }

    public function missed(Request $request)
    {
        $lead = Lead::create(['phone' => $request->phone, 'comment' => 'Пропущенный звонок']);
        return response()->json($lead->toArray());
    }

    public function addLead(Request $request)
    {
        $user = User::find($request->user_id);
        $lead = Lead::create([
            'phone' => $request->phone,
            'name' => $request->name,
            'status' => 'process',
            'comment' => $request->comment . ' | Добавлено сотрудником ' . $user->full_name
        ]);
        return response()->json($lead->toArray());
    }
}
