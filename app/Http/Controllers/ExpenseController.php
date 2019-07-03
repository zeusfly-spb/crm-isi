<?php

namespace App\Http\Controllers;

use App\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->date;
        $island_id = $request->island_id;
        $user_id = $request->user_id;

        $queryBuilder = Expense::with('user', 'island')->whereDate('created_at', $date);
        if ($island_id) {
            $queryBuilder = $queryBuilder->where('island_id', $island_id);
        }
        if ($user_id) {
            $queryBuilder = $queryBuilder->where('user_id', $user_id);
        }
        $expenses = $queryBuilder->get();

        return response()->json($expenses->toArray());
    }
}
