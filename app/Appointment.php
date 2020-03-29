<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Appointment extends Model
{
    protected $guarded = [];
    protected $appends = ['status', 'last_comment'];
    protected $casts = [
        'comments' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function performer()
    {
        return $this->belongsTo(User::class, 'performer_id', 'id');
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function island()
    {
        return $this->belongsTo(Island::class);
    }

    public function getStatusAttribute()
    {
        return $this->attributes['status'] ?? 'active';
    }

    public function addComment(string $text, int $user_id = null)
    {
        $newComment = (object) [
            'id' => Str::random(25),
            'user_id' => $user_id ?? 0,
            'text' => $text,
            'created_at' => now()->toDateTimeString()
        ];
        $comments = $this->comments ?? [];
        array_push($comments, $newComment);
        return $this->update(['comments' => $comments]);
    }

    public function getLastCommentAttribute()
    {
        if (!$this->comments) {
            return null;
        }
        return $this->comments[count($this->comments) - 1];
    }
}
