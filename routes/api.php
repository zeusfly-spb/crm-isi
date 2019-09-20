<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', 'API\UserController@login');
Route::post('register', 'API\UserController@register');

Route::group(['middleware' => 'auth:api'], function(){
    Route::post('details', 'API\UserController@details');
    Route::post('get_accounting_date', 'API\AccountingController@getAccountingDate');
    Route::post('set_accounting_date', 'API\AccountingController@setAccountingDate');
    Route::post('get_users', 'API\UserController@getUsers');
    Route::post('save_user', 'API\UserController@saveUser');
    Route::post('delete_user', 'API\UserController@deleteUser');
    Route::post('set_user_island', 'API\UserController@setUserIsland');
    Route::post('fire_user', 'API\UserController@fireUser');
    Route::post('restore_user', 'API\UserController@restoreUser');
    Route::post('update_user_date', 'API\UserController@updateDate');

    // GROUPS
    Route::post('get_groups', 'GroupController@all');
    Route::post('create_group', 'GroupController@create');
    Route::post('update_group', 'GroupController@update');
    Route::post('delete_group', 'GroupController@delete');

    // ACCESSES
    Route::post('create_access_request', 'AccessController@create');
    Route::post('check_access_status', 'AccessController@getAccessStatus');
    Route::post('get_accesses', 'AccessController@getAllAccesses');
    Route::post('set_access_status', 'AccessController@setStatus');
    Route::post('delete_access', 'AccessController@delete');

    // ISLANDS
    Route::post('get_islands', 'IslandController@getAll');
    Route::post('create_island', 'IslandController@create');
    Route::post('delete_island', 'IslandController@delete');
    Route::post('start_balance', 'IslandController@getStartBalance');
    Route::post('update_chief_id', 'IslandController@updateChiefId');

    // CUSTOMERS
    Route::post('get_customers', 'CustomerController@index');
    Route::post('create_customer', 'CustomerController@create');
    Route::post('update_customer', 'CustomerController@update');
    Route::post('delete_phone', 'CustomerController@deletePhone');
    Route::post('add_phone', 'CustomerController@addPhone');
    Route::post('search_customer_by_text', 'CustomerController@searchByText');
    Route::post('delete_customer', 'CustomerController@delete');

    // WORKDAYS
    Route::post('get_workdays', 'WorkDayController@index');
    Route::post('start_day', 'API\UserController@startDay');
    Route::post('finish_day', 'API\UserController@finishDay');
    Route::post('resume_day', 'API\UserController@resumeDay');
    Route::post('start_dinner', 'API\UserController@startDinner');
    Route::post('finish_dinner', 'API\UserController@finishDinner');
    Route::post('start_time_break', 'WorkDayController@startTimeBreak');
    Route::post('finish_time_break', 'WorkDayController@finishTimeBreak');
    Route::post('update_workday', 'WorkDayController@update');


    // DEALS
    Route::post('get_deals', 'DealController@index');
    Route::post('add_deal', 'DealController@create');
    Route::post('update_deal', 'DealController@update');
    Route::post('update_deal_with_stock', 'DealController@updateWithStock');
    Route::post('delete_deal', 'DealController@delete');

    // EXPENSES
    Route::post('get_expenses', 'ExpenseController@index');
    Route::post('add_expense', 'ExpenseController@create');
    Route::post('delete_expense', 'ExpenseController@delete');

    // HANDOVERS
    Route::post('get_handover', 'HandOverController@index');
    Route::post('add_handover', 'HandOverController@create');
    Route::post('update_handover', 'HandOverController@update');

    // RESERVES
    Route::post('get_reserves', 'ReserveController@index');

    // STOCK ACTIONS
    Route::post('get_stock_actions', 'StockActionController@index');
    Route::post('add_stock_action', 'StockActionController@create');
    Route::post('get_stock_options', 'StockActionController@getStockOptions');

    // SALARY
    Route::post('get_month_data', 'SalaryController@monthData');
    Route::post('update_user_rate', 'SalaryController@updateUserRate');
    Route::post('add_user_prize', 'SalaryController@addUserPrize');
    Route::post('delete_user_prize', 'SalaryController@deleteUserPrize');
    Route::post('add_user_forfeit', 'SalaryController@addUserForfeit');
    Route::post('delete_user_forfeit', 'SalaryController@deleteUserForfeit');
    Route::post('add_user_sick', 'SalaryController@addUserSick');
    Route::post('add_user_prepay', 'SalaryController@addUserPrepay');
    Route::post('delete_user_sick', 'SalaryController@deleteUserSick');
    Route::post('add_user_vacation', 'SalaryController@addUserVacation');
    Route::post('delete_user_vacation', 'SalaryController@deleteUserVacation');
    Route::post('delete_user_prepay', 'SalaryController@deleteUserPrepay');

    // LOADER
    Route::post('load_daily_page', 'LoaderController@loadDailyPage');

    // DOCUMENT PACK
    Route::post('upload_image', 'DocumentPackController@updateImage');
    Route::post('delete_image', 'DocumentPackController@deleteImage');

    // LEADS
    Route::post('get_leads', 'LeadController@index');
    Route::post('delete_lead', 'LeadController@delete');
    Route::post('update_lead_status', 'LeadController@updateStatus');
    Route::post('update_lead_comment', 'LeadController@updateComment');
    Route::post('add_lead_comment', 'LeadController@addComment');
    Route::post('delete_lead_comment', 'LeadController@deleteComment');
    Route::post('add_lead', 'LeadController@addLead');

});
