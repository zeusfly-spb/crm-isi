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
        $access = Access::where('device_id', $request->device_id)->first();
        if (!$access) {
            return response()->json(['status' => 'none']);
        }
        return response()->json(['status' => $access->status]);
    }
}
