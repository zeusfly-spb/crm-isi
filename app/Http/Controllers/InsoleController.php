<?php

namespace App\Http\Controllers;

use App\Http\Resources\InsoleResource;
use App\Insole;
use Illuminate\Http\Request;

class InsoleController extends Controller
{
    public function index()
    {
        return response()->json(InsoleResource::collection(Insole::all()));
    }
}
