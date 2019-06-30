<?php

namespace App\Http\Controllers;

use App\Deal;
use Illuminate\Http\Request;

class DealController extends Controller
{
    public function index(Request $request)
    {
        $user_id = $request->user_id;
        $island_id = $request->island_id;
        $date = $request->date;
        $queryBuilder = Deal::with('user')->whereDate('created_at', $date);
        if ($island_id) {
            $queryBuilder = $queryBuilder->where('island_id', $island_id);
        }
        if ($user_id) {
            $queryBuilder = $queryBuilder->where('user_id', $user_id);
        }
        return response()->json($queryBuilder->get()->toArray());
    }
}
