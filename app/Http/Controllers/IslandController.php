<?php

namespace App\Http\Controllers;

use App\Island;
use Illuminate\Http\Request;

class IslandController extends Controller
{
    public function create(Request $request)
    {
        $island = Island::create([
            'name' => $request->name,
            'description' => $request->description
        ]);
        $island->load('users');
        return response()->json($island->toArray());
    }

    public function getAll()
    {
        return response()->json(Island::with('users')->get()->toArray());
    }

    public function delete(Request $request)
    {
        return response()->json(['result' => Island::destroy($request->island_id)]);
    }
}
