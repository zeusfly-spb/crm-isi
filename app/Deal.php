<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    protected $guarded = [];
    protected $casts = [
        'is_cache' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
