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

    // GROUPS
    Route::post('get_groups', 'GroupController@all');
    Route::post('create_group', 'GroupController@create');
    Route::post('update_group', 'GroupController@update');
    Route::post('delete_group', 'GroupController@delete');

    //ACCESSES
    Route::post('create_access_request', 'AccessController@create');
    Route::post('check_access_status', 'AccessController@getAccessStatus');


});
