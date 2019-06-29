<?php

namespace App\Http\Controllers\API;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\AccountingDate;

class AccountingController extends Controller
{
    public function getAccountingDate()
    {
        return response()->json(['date' => now()->toDateString()]);
    }

}
