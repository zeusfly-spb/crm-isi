<?php

namespace App\Observers;

use App\Prize;
use Illuminate\Support\Facades\Cache;

class PrizeObserver
{
    /**
     * Handle the prize "created" event.
     *
     * @param  \App\Prize  $prize
     * @return void
     */
    public function created(Prize $prize)
    {
        $created = $prize->created_at;
        $date = explode(' ', $created)[0];
        $dateArray = explode('-', $date);
        array_pop($dateArray);
        $monthStr = implode('-', $dateArray);
        $cache_name = 'salary_' . $prize->island_id . '_' . $monthStr;
        Cache::forget($cache_name);
        $cache_name = 'salary_0_' . $monthStr;
        Cache::forget($cache_name);
    }

    /**
     * Handle the prize "updated" event.
     *
     * @param  \App\Prize  $prize
     * @return void
     */
    public function updated(Prize $prize)
    {
        $created = $prize->created_at;
        $date = explode(' ', $created)[0];
        $dateArray = explode('-', $date);
        array_pop($dateArray);
        $monthStr = implode('-', $dateArray);
        $cache_name = 'salary_' . $prize->island_id . '_' . $monthStr;
        Cache::forget($cache_name);
        $cache_name = 'salary_0_' . $monthStr;
        Cache::forget($cache_name);
    }

    /**
     * Handle the prize "deleted" event.
     *
     * @param  \App\Prize  $prize
     * @return void
     */
    public function deleted(Prize $prize)
    {
        $created = $prize->created_at;
        $date = explode(' ', $created)[0];
        $dateArray = explode('-', $date);
        array_pop($dateArray);
        $monthStr = implode('-', $dateArray);
        $cache_name = 'salary_' . $prize->island_id . '_' . $monthStr;
        Cache::forget($cache_name);
        $cache_name = 'salary_0_' . $monthStr;
        Cache::forget($cache_name);
    }

    /**
     * Handle the prize "restored" event.
     *
     * @param  \App\Prize  $prize
     * @return void
     */
    public function restored(Prize $prize)
    {
        //
    }

    /**
     * Handle the prize "force deleted" event.
     *
     * @param  \App\Prize  $prize
     * @return void
     */
    public function forceDeleted(Prize $prize)
    {
        //
    }
}
