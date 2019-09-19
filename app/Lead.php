<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $guarded = [];

    public function comments()
    {
        return $this->hasMany(LeadComment::class);
    }
}
