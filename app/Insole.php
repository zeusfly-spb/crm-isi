<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Insole extends Model
{
    protected $guarded = [];
    protected $appends = ['name'];

    public function getNameAttribute()
    {
        return $this->material . ' ' . $this->type . ' ' . $this->size;
    }
}
