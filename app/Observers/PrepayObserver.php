<?php

namespace App\Observers;

use App\Prepay;
use Illuminate\Support\Facades\Cache;

class PrepayObserver
{
    /**
     * Handle the prepay "created" event.
     *
     * @param  \App\Prepay  $prepay
     * @return void
     */
    public function created(Prepay $prepay)
    {
        $created = $prepay->created_at;
        $date = explode(' ', $created)[0];
        $dateArray = explode('-', $date);
        array_pop($dateArray);
        $monthStr = implode('-', $dateArray);
        $cache_name = 'salary_' . $prepay->island_id . '_' . $monthStr;
        Cache::forget($cache_name);
        $cache_name = 'salary_0_' . $monthStr;
        Cache::forget($cache_name);
    }

    /**
     * Handle the prepay "updated" event.
     *
     * @param  \App\Prepay  $prepay
     * @return void
     */
    public function updated(Prepay $prepay)
    {
        $created = $prepay->created_at;
        $date = explode(' ', $created)[0];
        $dateArray = explode('-', $date);
        array_pop($dateArray);
        $monthStr = implode('-', $dateArray);
        $cache_name = 'salary_' . $prepay->island_id . '_' . $monthStr;
        Cache::forget($cache_name);
        $cache_name = 'salary_0_' . $monthStr;
        Cache::forget($cache_name);
    }

    /**
     * Handle the prepay "deleted" event.
     *
     * @param  \App\Prepay  $prepay
     * @return void
     */
    public function deleted(Prepay $prepay)
    {
        $created = $prepay->created_at;
        $date = explode(' ', $created)[0];
        $dateArray = explode('-', $date);
        array_pop($dateArray);
        $monthStr = implode('-', $dateArray);
        $cache_name = 'salary_' . $prepay->island_id . '_' . $monthStr;
        Cache::forget($cache_name);
        $cache_name = 'salary_0_' . $monthStr;
        Cache::forget($cache_name);
    }

    /**
     * Handle the prepay "restored" event.
     *
     * @param  \App\Prepay  $prepay
     * @return void
     */
    public function restored(Prepay $prepay)
    {
        //
    }

    /**
     * Handle the prepay "force deleted" event.
     *
     * @param  \App\Prepay  $prepay
     * @return void
     */
    public function forceDeleted(Prepay $prepay)
    {
        //
    }
}
