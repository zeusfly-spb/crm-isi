<?php

namespace App;

use Illuminate\Support\Facades\Hash;
use Laravel\Passport\HasApiTokens;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
//    protected $fillable = [
//        'name', 'email', 'password',
//    ];

    protected $guarded = [];
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */

    public static function getUserByNameAndPassword($name, $password)
    {
        $users = self::where('name', $name)->get();
        foreach ($users as $user) {
            if (Hash::check($password, $user->password)) {
                return $user;
            }
        }
        return null;
    }
}
