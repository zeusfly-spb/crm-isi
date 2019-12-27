<?php

namespace App\Observers;

use App\Deal;
use App\Events\DealPerformed;
use Illuminate\Support\Facades\Cache;
use App\Jobs\CalculateSalary;


class DealObserver
{
    /**
     * Handle the deal "created" event.
     *
     * @param  \App\Deal  $deal
     * @return void
     */
    public function created(Deal $deal)
    {
//        event(new DealPerformed($deal));
//        $created = $deal->created_at;
//        $date = explode(' ', $created)[0];
//        $dateArray = explode('-', $date);
//        array_pop($dateArray);
//        $monthStr = implode('-', $dateArray);
//        $cache_name = 'salary_' . $deal->island_id . '_' . $monthStr;
//        Cache::forget($cache_name);
//        $cache_name = 'salary_0_' . $monthStr;
//        Cache::forget($cache_name);
        CalculateSalary::dispatch($deal);
    }

    /**
     * Handle the deal "updated" event.
     *
     * @param  \App\Deal  $deal
     * @return void
     */
    public function updated(Deal $deal)
    {
//        $created = $deal->created_at;
//        $date = explode(' ', $created)[0];
//        $dateArray = explode('-', $date);
//        array_pop($dateArray);
//        $monthStr = implode('-', $dateArray);
//        $cache_name = 'salary_' . $deal->island_id . '_' . $monthStr;
//        Cache::forget($cache_name);
//        $cache_name = 'salary_0_' . $monthStr;
//        Cache::forget($cache_name);
        CalculateSalary::dispatch($deal);
    }

    /**
     * Handle the deal "deleted" event.
     *
     * @param  \App\Deal  $deal
     * @return void
     */
    public function deleted(Deal $deal)
    {
        //
    }

    /**
     * Handle the deal "restored" event.
     *
     * @param  \App\Deal  $deal
     * @return void
     */
    public function restored(Deal $deal)
    {
        //
    }

    /**
     * Handle the deal "force deleted" event.
     *
     * @param  \App\Deal  $deal
     * @return void
     */
    public function forceDeleted(Deal $deal)
    {
        //
    }
}
