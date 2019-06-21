<?php

namespace App\Http\Controllers;

use App\Island;
use Illuminate\Http\Request;

class IslandController extends Controller
{
    public function create(Request $request)
    {
        return response()->json(Island::create([
            'name' => $request->name,
            'description' => $request->description
        ])->toArray());
    }

    public function getAll()
    {
        return response()->json(Island::with('users')->get()->toArray());
    }
}
