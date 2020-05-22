<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Subscribe extends Model
{
    protected $guarded = [];
    protected $casts = [
        'comments' => 'array'
    ];
    protected $appends = ['finish_date'];

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function addComment(string $text, int $user_id = null)
    {
        $comments = $this->attributes['comments'] ? $this->comments : [];
         array_push($comments, (object) [
            'user_id' => $user_id,
            'text' => $text
        ]);
        $this->update(['comments' => $comments]);
    }

    public function getFinishDateAttribute()
    {
        $startDate = new Carbon($this->start_date);
        $finishDate = $startDate->addDays($this->subscription->number_days);
        return $finishDate->toDateString();
    }
}