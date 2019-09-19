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

    public function addComment(string $text, int $user_id)
    {
        return $this->comments()->create(['user_id' => $user_id, 'text' => $text]);
    }
}
