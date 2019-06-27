<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $guarded = [];

    public function phones()
    {
        return $this->hasMany(Phone::class);
    }
}