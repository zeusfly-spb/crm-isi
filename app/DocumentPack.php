<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DocumentPack extends Model
{
    protected $guarded = [];
    protected $appends = ['filled'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getFilledAttribute()
    {
        return $this->passport && $this->inn && $this->snils && $this->contract && $this->contract;
    }
}
