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

    protected $guarded = [];
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $appends = [
        'full_name'
    ];

    protected $casts = [
        'is_superadmin' => 'boolean'
    ];

    public function getFullNameAttribute()
    {
        return collect([
            $this->last_name,
            $this->first_name,
            $this->patronymic,
        ])->filter(static function($str) {
            return mb_strlen($str) > 0;
        })->implode(' ');
    }

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

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
