<?php

namespace App\Http\Controllers;

use App\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;


class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->date;
        $island_id = $request->island_id;

        if (Cache::has('appointments') && Cache::has('users') && Cache::has('services') && Cache::has('leads') && Cache::has('islands')) {
            Log::info('Get from cache');
            $appointments = Cache::get('appointments')->filter(function ($value) use ($date, $island_id) {
                if ($island_id) {
                    return explode(' ', $value->date)[0] == $date && $value->island_id == $island_id;
                } else {
                    return explode(' ', $value->date)[0] == $date;
                }
            });
            $appointments->each(function ($item) {
                $item->user = Cache::get('users')->where('id', $item->user_id)->first();
                $item->performer = Cache::get('users')->where('id', $item->performer_id)->first();
                $item->service = Cache::get('services')->where('id', $item->service_id)->first();
                $item->island = Cache::get('islands')->where('id', $item->island_id)->first();
            });
            $appointments = $appointments->values();
        } else {
            Log::info('Querying from mysql at setting appointments at ' . now()->toDateTimeString() . PHP_EOL);
            $queryBuilder = Appointment::with('user', 'performer', 'service', 'lead', 'island')->whereDate('date', $date);
            if ($island_id) {
                $queryBuilder = $queryBuilder->where('island_id', $island_id);
            }
            $appointments = $queryBuilder->get();
        }
        return response()->json($appointments->toArray());
    }

    public function create(Request $request)
    {
        $appointment = Appointment::create($request->all());
        return response()->json($appointment->toArray());
    }

    public function update(Request $request)
    {
        $appointment = Appointment::find($request->id);
        $appointment->update($request->all());
        return response()->json($appointment->toArray());
    }

    public function delete(Request $request)
    {
        $result = Appointment::destroy($request->id);
        return response()->json(['result' => $result]);
    }
}
