<?php

namespace App\Http\Controllers;

use App\SmsReport;
use Illuminate\Http\Request;

class SmsReportController extends Controller
{
    public function create(Request $request)
    {
        $smsReport = SmsReport::create($request->all());
        return response()->json($smsReport->toArray());
    }
}
