<?php

namespace App\Http\Controllers\API;

use http\Env\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Arr;
use Webpatser\Uuid\Uuid;


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

        if ($request->hasFile('avatar')) {
            $fileName = (string) Uuid::generate(4);
            $request->file('avatar')->storeAs(
                'public/avatars', $fileName
            );
            $input['avatar'] = '/storage/avatars/' . $fileName;
        }

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
        $input = Arr::except($request->all(), ['password', 'c_password', 'full_name']);

        if ($request->password && $request->c_password && $request->password === $request->c_password) {
            $users = User::where('name', $request->name)->get();
            foreach ($users as $user) {
                if (Hash::check($request->password, $user->password)) {
                    return response()->json(['error' => 'Пользователь с такими данными уже зарегистрирован  ']);
                }
            }
            $user->update(['password' => bcrypt($request->password)]);
        }

        if ($request->hasFile('avatar')) {
            $fileName = (string) Uuid::generate(4);
            $request->file('avatar')->storeAs(
                'public/avatars', $fileName
            );
            $input['avatar'] = '/storage/avatars/' . $fileName;
        }

        $user->update($input);
        return $user;
    }

    public function deleteUser(Request $request)
    {
        return response()->json(['result' => User::destroy($request->id)]);
    }

    public function setUserIsland(Request $request)
    {
        $user = User::find($request->user_id);
        $user->update(['island_id' => $request->island_id]);
        return response()->json($user);
    }

    public function startDay(Request $request)
    {
        $user = User::find($request->user_id);
        $workday = $user->startDay();
        return response()->json($workday->toArray());
    }

    public function finishDay(Request $request)
    {
        $user = User::find($request->user_id);
        $currentWorkDay = $user->workdays()->whereDate('created_at', now()->toDateString())->first();
//        $currentWorkDay = $user->finishDay($request->all());
//        return response()->json($currentWorkDay->toArray());
        $currentWorkDay->update([
            'time_finish' => now()->toTimeString(),
            'working_hours' => $request->working_hours
        ]);

//        return response()->json($currentWorkDay->closeDay()->toArray());
        $currentWorkDay->load('user', 'timeBreaks');
        return response()->json($currentWorkDay->toArray());
    }

    public function resumeDay(Request $request)
    {
        $user = User::find($request->user_id);
        $currentWorkDay = $user->resumeDay();
        return response()->json($currentWorkDay->toArray());
    }

    public function startDinner(Request $request)
    {
        $user = User::find($request->user_id);
        $currentWorkDay = $user->startDinner();
        return response()->json($currentWorkDay->toArray());
    }

    public function finishDinner(Request $request)
    {
        $user = User::find($request->user_id);
        $currentWorkDay = $user->finishDinner();
        return response()->json($currentWorkDay->toArray());
    }

}
