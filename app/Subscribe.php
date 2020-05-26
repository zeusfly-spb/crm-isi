<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class Subscribe extends Model
{
    protected $guarded = [];
    protected $casts = [
        'comments' => 'array'
    ];
    protected $appends = ['finish_date', 'last_comment', 'nominal'];

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
         array_unshift($comments, (object) [
             'id' => Str::uuid(),
             'user_id' => $user_id,
             'text' => $text,
             'created_at' => now()->toDateTimeString()
        ]);
        $this->update(['comments' => $comments]);
    }

    public function deleteComment(string $id)
    {
        $comments = $this->comments;
        $comments = Arr::where($comments, function ($item) use ($id) {
            return $item['id'] !== $id;
        });
        $this->update(['comments' => $comments]);
    }

    public function getLastCommentAttribute()
    {
        if (!$this->attributes['comments']) {
            return null;
        }
        return $this->comments[0] ?? null;
    }

    public function getFinishDateAttribute()
    {
        $startDate = new Carbon($this->start_date);
        $finishDate = $startDate->addDays($this->subscription->number_days);
        return $finishDate->toDateString();
    }

    public function events()
    {
        return $this->hasMany(Appointment::class);
    }

    public function addEvent(array $data)
    {
        return $this->events()->create($data);
    }

    public function getNominalAttribute()
    {
        return $this->subscription->supply_amount ?? 0;
    }
}
