<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $guarded = [];
    protected $statusCatalog = [
        null => 'active',
        0 => 'canceled',
        1 => 'completed'
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
}
