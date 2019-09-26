<?php

namespace App\Http\Controllers;

use App\Customer;
use App\Phone;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $customers = Customer::with('phones')
            ->whereDate('created_at', $request->date)
            ->get();
        return response()->json($customers->toArray());
    }

    public function create(Request $request)
    {
        $input = $request->all();

        $input = Arr::except($input, ['phone', 'phones']);
        $customer = Customer::create($input);

        if ($request->phone) {
            $customer->phones()->create(['number' => $request->phone]);
        }

        $customer->load('phones');
        return response()->json($customer->toArray());
    }

    public function update(Request $request)
    {
        $customer = Customer::find($request->id);
        $input = Arr::except($request->all(), ['id', 'phones', 'phone', 'full_name']);

        $customer->update($input);
        $customer->load('phones');
        return response()->json($customer->toArray());
    }

    public function deletePhone(Request $request)
    {
        Phone::destroy($request->phone_id);
        return response()->json(Customer::with('phones')->find($request->customer_id)->toArray());
    }

    public function addPhone(Request $request)
    {
        $customer = Customer::find($request->customer_id);
        $customer->phones()->create(['number' => $request->number]);
        $customer->load('phones');
        return response()->json($customer->toArray());
    }

    public function searchByText(Request $request)
    {
        $text = $request->text;
        $queryBuilder = Customer::query();
        $queryBuilder = $queryBuilder
            ->where('last_name', 'LIKE',$text . '%')
//            ->orWhere('last_name', 'LIKE', '%' . $text . '%')
//            ->orWhere('patronymic', 'LIKE', '%' . $text . '%')
            ->orWhereHas('phones', function($query) use($text) {
                $query->where('number', 'LIKE', '%' . $text . '%');
            });
        return response()->json($queryBuilder->with('phones')->get()->toArray());
    }

    public function delete(Request $request)
    {
        Customer::destroy($request->customer_id);
    }
}
