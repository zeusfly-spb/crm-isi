<?php

namespace App\Http\Controllers;

use App\Lead;
use App\LeadComment;
use App\Postpone;
use App\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

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

    public function index(Request $request)
    {
        if ($request->with_done) {
            try {
                $withoutDone = Lead::with('comments', 'user', 'postpones')
                    ->where('status', '<>', 'done')
                    ->get()->reverse()->values()->toArray();
                $doneLeads = Lead::where('status', 'done')
                    ->get()->reverse()->values()->toArray();
                $leads = $withoutDone;
            } catch (Exception $e) {
                Log::info('Problems:( ');
                Log::info($e);
            }

        } else {
            $leads = Lead::with('comments', 'user', 'postpones')
                ->where('status', '<>', 'done')
                ->get()->reverse()->values()->toArray();
        }
        return response()->json($leads);
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
        $lead = Lead::create(['phone' => substr($request->phone, -10), 'comment' => 'Пропущенный звонок']);
        $lead->addComment('Пропущенный звонок', null);
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

    public function deletePostpone(Request $request)
    {
        $postpone = Postpone::find($request->postpone_id);
        $lead = Lead::find($postpone->lead_id);
        $postpone->delete();
        $lead->load('postpones');
        return response()->json($lead->toArray());
    }

    public function addCall(Request $request)
    {
        $lead = Lead::find($request->lead_id);
        $lead->addCall((object)['timestamp' =>  now()->toDateTimeString(), 'user_id' => $request->user_id]);
        $lead->load('postpones');
        return response()->json($lead->toArray());
    }
}
