<?php

namespace App\Http\Controllers;

use App\WorkDay;
use Illuminate\Http\Request;

class WorkDayController extends Controller
{
    public function index(Request $request)
    {
        $island_id = $request->island_id;
        $queryBuilder = WorkDay::whereDate('date', $request->date);
        if ($island_id > 0) {
            $queryBuilder = $queryBuilder->whereHas('user', function($query) use ($island_id) {
                $query->where('island_id', $island_id);
            });
        }
        return response()->json($queryBuilder->get()->toArray());
    }
}
