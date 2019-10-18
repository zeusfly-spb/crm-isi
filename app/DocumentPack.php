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

    public function customDocs()
    {
        return $this->hasMany(CustomDoc::class);
    }

    public function getFilledAttribute()
    {
        return $this->passport && $this->inn && $this->snils && $this->contract && $this->secret;
    }

    public function addCustomDoc($name)
    {
        return  $this->customDocs()->create(['name' => $name]);
    }
}
