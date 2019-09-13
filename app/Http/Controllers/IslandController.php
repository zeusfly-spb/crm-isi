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

    public function getStartBalance(Request $request)
    {
        $date = $request->date;
        $island_id = $request->island_id;
        if ($island_id) {
            $island = Island::find($island_id);
            return response()->json(['amount' => $island->startBalance($date)]);
        } else {
            $islands = Island::all();
            $amount =  $islands->reduce(function ($carry, $island) use($date) {
                return $carry + $island->startBalance($date);
            }, 0);
            return response()->json(['amount' => $amount]);
        }
    }

    public function updateChiefId(Request $request)
    {
        $island = Island::with('users')->find($request->island_id);
        $island->update(['chief_id' => $request->chief_id]);
        return response()->json($island->toArray());
    }
}
