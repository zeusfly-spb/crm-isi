<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $guarded = [];
    protected $appends = ['last_postpone'];

    public function comments()
    {
        return $this->hasMany(LeadComment::class)->with('user');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function postpones()
    {
        return $this->hasMany(Postpone:: class);
    }

    public function addComment(string $text, $user_id = null)
    {
        return $this->comments()->create(['user_id' => $user_id, 'text' => $text]);
    }

    public function addPostpone($date, $user_id)
    {
        return $this->postpones()->create([
            'user_id' => $user_id,
            'date' => $date
        ]);
    }

    public function getLastPostponeAttribute()
    {
        return $this->postpones->last()->date ?? null;
    }
}
