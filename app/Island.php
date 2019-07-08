<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Island extends Model
{
    protected $guarded = [];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function startDays()
    {
        return $this->hasMany(StartDay::class);
    }

    public function deals()
    {
        return $this->hasMany(Deal::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function dateBalance(string $date)
    {
        return $this->deals()->whereDate('created_at', $date)->get()
            ->reduce(function ($acc, $deal) {
                return $deal->is_cache ? $acc + $deal->income - $deal->expense : $acc;
            }, $this->startBalance($date));
    }

    public function startBalance(string $date)
    {
        return $this->startDays()->whereDate('created_at', $date)->first()->amount ?? 0;
    }

    public function dateExpenses(string $date)
    {
        return $this->expenses()->whereDate('created_at', $date)->get()
            ->reduce(function ($acc, $item) {
                return $acc + $item->amount;
            }, 0);
    }

    public function makeStartDate()
    {
        $yesterday = Carbon::yesterday()->toDateString();
        return $this->startDays()->create(['amount' => $this->dateBalance($yesterday) - $this->dateExpenses($yesterday)]);
    }

}
