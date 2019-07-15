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

    // INSOLES
    Route::post('get_insoles', 'InsoleController@index');

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

    // DEALS
    Route::post('get_deals', 'DealController@index');
    Route::post('add_deal', 'DealController@create');
    Route::post('update_deal', 'DealController@update');
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
});
