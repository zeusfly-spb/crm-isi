<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkDay extends Model
{
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function timeBreaks()
    {
        return $this->hasMany(TimeBreak::class);
    }

    public function startTimeBreak()
    {
        return $this->timeBreaks()->create(['start_time' => now()->toTimeString()]);
    }

    public function finishTimeBreak()
    {
        $currentTimeBreak = $this->timeBreaks()->whereDate('created_at', now()->toDateString())->where('finish_time', null)->first();
        $currentTimeBreak->update(['finish_time' => now()->toTimeString()]);
        return $currentTimeBreak;
    }
}
