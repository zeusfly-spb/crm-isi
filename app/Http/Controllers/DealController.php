<?php

namespace App\Http\Controllers;

use App\Deal;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class DealController extends Controller
{
    public function index(Request $request)
    {
        $user_id = $request->user_id;
        $island_id = $request->island_id;
        $date = $request->date;
        $queryBuilder = Deal::with('user', 'customer')->whereDate('created_at', $date);
        if ($island_id) {
            $queryBuilder = $queryBuilder->where('island_id', $island_id);
        }
        if ($user_id) {
            $queryBuilder = $queryBuilder->where('user_id', $user_id);
        }
        return response()->json($queryBuilder->get()->toArray());
    }

    public function create(Request $request)
    {
        $deal = Deal::create($request->all());
        $deal->load('user', 'customer');
        return response()->json($deal->toArray());
    }

    public function update(Request $request)
    {
        $deal = Deal::find($request->id);
        $deal->update([
            'income' => (int) $request->income,
            'expense' => (int) $request->expense,
            'is_cache' => (bool) $request->is_cache,
            'customer_id' => (int) $request->customer_id,
            'user_id' => (int) $request->user_id,
            'deal_action_id' => (int) $request->deal_customer_id,
            'product_id' => (int) $request->product_id,
            'type_id' => (int) $request->type_id,
            'size_id' => (int) $request->size
        ]);
        $deal->load('user', 'customer');

        return response()->json($deal->toArray());
    }

    public function delete(Request $request)
    {
        return response()->json(['result' => Deal::destroy($request->id)]);
    }
}
