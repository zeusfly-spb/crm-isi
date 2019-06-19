<?php

namespace App\Http\Controllers\API;

use http\Env\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Arr;


class UserController extends Controller
{
    public $successStatus = 200;


    /**
     * login api
     *
     * @return \Illuminate\Http\Response
     */
    public function login(){
        $testUser = User::getUserByNameAndPassword(request('name'), request('password'));
        /**
        if(Auth::attempt(['name' => request('name'), 'password' => request('password')])){
            $user = Auth::user();
            $success['token'] =  $user->createToken('MyApp')-> accessToken;
            return response()->json(['success' => $success], $this-> successStatus);
        }
        **/
        if ($testUser) {
            $user = $testUser;
            $success['token'] =  $user->createToken('MyApp')-> accessToken;
            return response()->json(['success' => $success], $this-> successStatus);
        }
        else{
            return response()->json(['error'=>'Unauthorised'], 401);
        }
    }

    /**
     * Register api
     *
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'password' => 'required',
            'c_password' => 'required|same:password',
        ]);
        if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()], 401);
        }

        $users = User::where('name', $request->name)->get();
        foreach ($users as $user) {
            if (Hash::check($request->password, $user->password)) {
                return response()->json(['error' => 'Пользователь с такими данными уже зарегистрирован  ']);
            }
        }

        $input = Arr::except($request->all(), ['c_password']);
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);
        $success['token'] =  $user->createToken('MyApp')-> accessToken;
        $success['name'] =  $user->name;
        $success['user'] = $user;
        return response()->json(['success'=>$success], $this-> successStatus);
    }

    /**
     * details api
     *
     * @return \Illuminate\Http\Response
     */
    public function details()
    {
        $user = Auth::user();
        return response()->json(['success' => $user], $this-> successStatus);
    }

    public function getUsers()
    {
        return response()->json(User::get()->toArray());
    }

    public function saveUser(Request $request)
    {
        $user = User::find($request->id);

        if ($request->password && $request->c_password && $request->password === $request->c_password) {
            $users = User::where('name', $request->name)->get();
            foreach ($users as $user) {
                if (Hash::check($request->password, $user->password)) {
                    return response()->json(['error' => 'Пользователь с такими данными уже зарегистрирован  ']);
                }
            }
            $user->update(['password' => bcrypt($request->password)]);
        }

        $user->update(Arr::except($request->all(), ['password', 'c_password']));
        return $user;
    }

}
