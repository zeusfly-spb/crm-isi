<?php

namespace App\Http\Controllers;

use App\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class CatalogController extends Controller
{
    public function createService(Request $request)
    {
        $service = Service::create($request->all());
        return response()->json($service->toArray());
    }

    public function updateService(Request $request)
    {
        $service = Service::find($request->id);
        $inputs = Arr::except($request->all(), ['id']);
        $service->update($inputs);
        return response()->json($service->toArray());
    }

    public function deleteService(Request $request)
    {
        return response()->json(['result' => Service::destroy($request->id)]);
    }
}
