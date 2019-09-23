<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $guarded = [];

    public function comments()
    {
        return $this->hasMany(LeadComment::class)->with('user');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function addComment(string $text, $user_id = null)
    {
        return $this->comments()->create(['user_id' => $user_id, 'text' => $text]);
    }
}
