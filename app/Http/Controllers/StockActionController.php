<?php

namespace App\Http\Controllers;

use App\Stock\StockAction;
use Illuminate\Http\Request;

class StockActionController extends Controller
{
    public function index(Request $request)
    {
        $queryBuilder = StockAction::with('product', 'type', 'size')->whereDate('created_at', $request->date);
        if ($request->island_id) {
            $queryBuilder = $queryBuilder->where('island_id', $request->island_id);
        }
        return response()->json($queryBuilder->get()->toArray());
    }
}
