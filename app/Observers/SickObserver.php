<?php

namespace App\Observers;

use App\Jobs\CalculateSalary;
use App\Sick;
use Illuminate\Support\Facades\Cache;

class SickObserver
{
    /**
     * Handle the sick "created" event.
     *
     * @param  \App\Sick  $sick
     * @return void
     */
    public function created(Sick $sick)
    {
//        $created = $sick->created_at;
//        $date = explode(' ', $created)[0];
//        $dateArray = explode('-', $date);
//        array_pop($dateArray);
//        $monthStr = implode('-', $dateArray);
//        $cache_name = 'salary_' . $sick->island_id . '_' . $monthStr;
//        Cache::forget($cache_name);
//        $cache_name = 'salary_0_' . $monthStr;
//        Cache::forget($cache_name);
        CalculateSalary::dispatch($sick);

    }

    /**
     * Handle the sick "updated" event.
     *
     * @param  \App\Sick  $sick
     * @return void
     */
    public function updated(Sick $sick)
    {
//        $created = $sick->created_at;
//        $date = explode(' ', $created)[0];
//        $dateArray = explode('-', $date);
//        array_pop($dateArray);
//        $monthStr = implode('-', $dateArray);
//        $cache_name = 'salary_' . $sick->island_id . '_' . $monthStr;
//        Cache::forget($cache_name);
//        $cache_name = 'salary_0_' . $monthStr;
//        Cache::forget($cache_name);
        CalculateSalary::dispatch($sick);
    }

    /**
     * Handle the sick "deleted" event.
     *
     * @param  \App\Sick  $sick
     * @return void
     */
    public function deleted(Sick $sick)
    {
//        $created = $sick->created_at;
//        $date = explode(' ', $created)[0];
//        $dateArray = explode('-', $date);
//        array_pop($dateArray);
//        $monthStr = implode('-', $dateArray);
//        $cache_name = 'salary_' . $sick->island_id . '_' . $monthStr;
//        Cache::forget($cache_name);
//        $cache_name = 'salary_0_' . $monthStr;
//        Cache::forget($cache_name);
        CalculateSalary::dispatch($sick);
    }

    /**
     * Handle the sick "restored" event.
     *
     * @param  \App\Sick  $sick
     * @return void
     */
    public function restored(Sick $sick)
    {
        //
    }

    /**
     * Handle the sick "force deleted" event.
     *
     * @param  \App\Sick  $sick
     * @return void
     */
    public function forceDeleted(Sick $sick)
    {
        //
    }
}
