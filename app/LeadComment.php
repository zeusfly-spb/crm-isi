<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LeadComment extends Model
{
    protected $guarded = [];

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
}
