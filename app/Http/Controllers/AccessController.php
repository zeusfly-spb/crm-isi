<?php

namespace App\Http\Controllers;

use App\Access;
use Illuminate\Http\Request;
use Webpatser\Uuid\Uuid;

class AccessController extends Controller
{
    public function create(Request $request)
    {
        $device_id = (string) Uuid::generate(4);
        $access = Access::create([
            'user_id' => $request->user_id,
            'device_id' => $device_id,
            'status' => 'requested',
            'comment' => $request->comment,
        ]);
        return response()->json($access->toArray());
    }

    public function getAccessStatus(Request $request)
    {
        $access = Access::where('device_id', $request->device_id)->last();
        if (!$access) {
            return response()->json(['status' => 'none']);
        }
        return response()->json($access->toArray());
    }

    public function getAllAccesses()
    {
        return response()->json(Access::all()->toArray());
    }

    public function setStatus(Request $request)
    {
        $access = Access::find($request->access_id);
        $access->update(['status' => $request->status, 'island_id' => $request->island_id]);
        return response()->json(['access' => $access->toArray()]);
    }
}
