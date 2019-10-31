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
        'full_name',
        'vpbx_extension'
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

    public function island()
    {
        return $this->belongsTo(Island::class)->withDefault(['name' => 'Без островка']);
    }

    public function workdays()
    {
        return $this->hasMany(WorkDay::class);
    }

    public function startDay()
    {
        $now = now();
        $workday = $this->workdays()->create([
            'date' => $now->toDateString(),
            'time_start' => $now->toTimeString()
        ]);
        $workday->load('user');
        return $workday;
    }

    public function finishDay(Array $data)
    {
        $currentWorkDay = $this->workdays()->whereDate('date', now()->toDateString())->first();
        $currentWorkDay->update([
            'time_finish' => now()->toTimeString(),
            'working_hours' => $data['working_hours'] ?? null,
            'dinner_start' => $data['dinner_start'] ?? null,
            'dinner_finish' => $data['dinner_finish'] ?? null
        ]);
        $currentWorkDay->load('user');
        return $currentWorkDay;
    }

    public function resumeDay()
    {
        $currentWorkDay = $this->workdays()->whereDate('date', now()->toDateString())->first();
        $currentWorkDay->update(['time_finish' => null]);
        $currentWorkDay->load('user');
        return $currentWorkDay;
    }

    public function startDinner()
    {
        $currentWorkDay = $this->workdays()->whereDate('date', now()->toDateString())->first();
        $currentWorkDay->update(['dinner_start' => now()->toTimeString()]);
        $currentWorkDay->load('user');
        return $currentWorkDay;
    }

    public function finishDinner()
    {
        $currentWorkDay = $this->workdays()->whereDate('date', now()->toDateString())->first();
        $currentWorkDay->update(['dinner_finish' => now()->toTimeString()]);
        $currentWorkDay->load('user');
        return $currentWorkDay;
    }

    public function deals()
    {
        return $this->hasMany(Deal::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function handovers()
    {
        return $this->hasMany(HandOver::class);
    }

    public function prizes()
    {
        return $this->hasMany(Prize::class);
    }

    public function forfeits()
    {
        return $this->hasMany(Forfeit::class);
    }

    public function sicks()
    {
        return $this->hasMany(Sick::class);
    }

    public function prepays()
    {
        return $this->hasMany(Prepay::class);
    }

    public function vacations()
    {
        return $this->hasMany(Vacation::class);
    }

    public function addPrize(int $amount, string $date, string $comment = '')
    {
        return $this->prizes()->create([
            'amount' => $amount,
            'comment' => $comment,
            'created_at' => $date
        ]);
    }

    public function addForfeit(int $amount, string $date, string $comment = '')
    {
        return $this->forfeits()->create([
            'amount' => $amount,
            'comment' => $comment,
            'created_at' => $date
        ]);
    }

    public function addSick(int $amount, string $date, string $comment = '')
    {
        return $this->sicks()->create([
                'amount' => $amount,
                'comment' => $comment,
                'created_at' => $date
        ]);
    }

    public function addPrepay(int $amount, string $date, $comment = '')
    {
        return $this->prepays()->create([
            'amount' => $amount,
            'comment' => $comment,
            'created_at' => $date
        ]);
    }

    public function addVacation(int $amount, string $date, $comment = '')
    {
        return $this->vacations()->create([
            'amount' => $amount,
            'comment' => $comment,
            'created_at' => $date
        ]);
    }

    public function documentPack()
    {
        return $this->hasOne(DocumentPack::class)->with('customDocs');
    }

    public function createDocumentPack()
    {
        $this->documentPack()->create();
    }

    public function controlledIslands()
    {
        return $this->hasMany(Island::class, 'chief_id', 'id')->with('users');
    }

    public function getVpbxExtensionAttribute()
    {
        if ($this->island->vpbx_extension) {
            return $this->island->vpbx_extension;
        }
        return $this->attributes['vpbx_extension'];
    }
}
