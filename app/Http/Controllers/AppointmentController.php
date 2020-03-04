<?php

namespace App\Http\Controllers;

use App\Appointment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;



class AppointmentController extends Controller
{
    public function change_status(Request $request)
    {
        $event = Appointment::find($request->event_id);
        $event->update(['status' => $request->status]);
        $event->load('user', 'performer', 'service', 'lead', 'island');
        return response()->json($event->toArray());
    }

    public function move(Request $request)
    {
        $event = Appointment::find($request->event_id);
        $eventTimeArr = explode(':', explode(' ', $event->date)[1]);
        $newDate = $request->date . ' ' . $request->hour . ':' . $eventTimeArr[1] . ':' . $eventTimeArr[2];
        $event->update(['date' => $newDate, 'cabinet_id' => $request->cabinet_id]);
        $event->load('user', 'performer', 'service', 'lead', 'island');
        return response()->json($event->toArray());
    }

    public function index(Request $request)
    {
        $base_date = new Carbon($request->date);
        $start_date = $base_date->startOfMonth()->toDateString();
        $end_date = $base_date->endOfMonth()->toDateString();
        $year = $base_date->year;
        $month = $base_date->month;
        $island_id = $request->island_id;

        if (Cache::has('appointments') && Cache::has('users') && Cache::has('services') && Cache::has('leads') && Cache::has('islands')) {
            Log::info('Appointments index get from cache');
            $appointments = Cache::get('appointments')->filter(function ($value) use ($start_date, $end_date, $island_id) {
                $clearDate = explode(' ', $value->date)[0];
                if ($island_id) {
                    return ($clearDate >= $start_date && $clearDate <= $end_date) && $value->island_id == $island_id;
                } else {
                    return $clearDate >= $start_date && $clearDate <= $end_date;
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
            Log::info('Appointments index querying from mysql!');
            $queryBuilder = Appointment::with('user', 'performer', 'service', 'lead', 'island')
                ->whereYear('date', $year)
                ->whereMonth('date', $month);
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
        $appointment->load('user', 'performer', 'service', 'lead', 'island');
        return response()->json($appointment->toArray());
    }

    public function update(Request $request)
    {
        $appointment = Appointment::find($request->id);
        $inputs = Arr::only($request->all(), array_values(Schema::getColumnListing($appointment->getTable())));
        $appointment->update($inputs);
        $appointment->load('user', 'performer', 'service', 'lead', 'island');
        return response()->json($appointment->toArray());
    }

    public function delete(Request $request)
    {
        $result = Appointment::destroy($request->id);
        return response()->json(['result' => $result]);
    }
}
