<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\CreateSmsReport;

class SmsReportController extends Controller
{
    public function create(Request $request)
    {
        CreateSmsReport::dispatch($request->all());
    }
}
