<?php

namespace App\Http\Controllers;

use App\Deal;
use App\Island;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CacheController extends Controller
{
    public function cacheAll()
    {
        Cache::put('deals', Deal::all());
        Cache::put('users', User::all());
        Cache::put('islands', Island::all());
    }

    public function insertItem($key, $item)
    {
        $data = Cache::get($key);
        $data[] = $item;
        Cache::put($key, $data);
    }
}
