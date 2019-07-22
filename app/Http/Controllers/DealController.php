<?php

namespace App\Http\Controllers;

use App\Deal;
use App\DealAction;
use App\Stock\Product;
use App\Stock\Size;
use App\Stock\StockAction;
use App\Stock\Type;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class DealController extends Controller
{
    private $products;
    private $types;
    private $sizes;
    private $actions;

    public function __construct()
    {

        $this->types = Type::all();
        $this->sizes = Size::all();
        $this->products = Product::all();
        $this->actions = DealAction::all();
    }

    public function index(Request $request)
    {
        $user_id = $request->user_id;
        $island_id = $request->island_id;
        $date = $request->date;
        $queryBuilder = Deal::with('user', 'customer', 'action')->whereDate('created_at', $date);
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
        $newDealAction = $this->actions->where('id', $request->deal_action_id)->first()->type;
        $inputs = $request->all();

        if ($newDealAction === 'correction' || $newDealAction === 'prodDefect' || $newDealAction === 'islandDefect' || $newDealAction === 'alteration') {
            $inputs['income'] = 0;
            $inputs['expense'] = 0;
        }

        if ($newDealAction === 'return') {
            $inputs['expense'] = $inputs['income'];
            $inputs['income'] = 0;
        }

        $deal = Deal::create($inputs);
        $deal->load('user', 'customer', 'action');

        if ($deal->action_type !== 'correction') {
            $deal->stockAction()->create([
                'user_id' => $request->user_id,
                'type' => 'expense',
                'island_id' => $request->island_id,
                'product_id' => $request->product_id,
                'type_id' => $request->type_id,
                'size_id' => $request->size_id,
                'count' => 1,
                'comment' => $deal->action->text . ' ' . $this->products->where('id', $request->product_id)->first()->name
                    . ' ' . $this->types->where('id', $request->type_id)->first()->name . ' ' . $this->sizes->where('id', $request->size_id)->first()->name
            ]);
        }

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
            'deal_action_id' => (int) $request->deal_action_id,
            'product_id' => (int) $request->product_id,
            'type_id' => (int) $request->type_id,
            'size_id' => (int) $request->size
        ]);
        $deal->load('user', 'customer', 'action');

        return response()->json($deal->toArray());
    }

    public function delete(Request $request)
    {
        $deal = Deal::find($request->id);
        if ($deal->stockAction) {
            $deal->stockAction->delete();
        }
        return response()->json(['result' => Deal::destroy($request->id)]);
    }
}
