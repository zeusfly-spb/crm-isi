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

    public function customer()
    {
        return $this->belongsTo(Customer::class)->withDefault([
            'first_name' => 'Аноним'
        ]);
    }

    public function insole()
    {
        return $this->belongsTo(Insole::class);
    }
}
