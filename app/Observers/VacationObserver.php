<?php

namespace App\Observers;

use App\Jobs\CalculateSalary;
use App\Vacation;
use Illuminate\Support\Facades\Cache;

class VacationObserver
{
    /**
     * Handle the vacation "created" event.
     *
     * @param  \App\Vacation  $vacation
     * @return void
     */
    public function created(Vacation $vacation)
    {
//        $created = $vacation->created_at;
//        $date = explode(' ', $created)[0];
//        $dateArray = explode('-', $date);
//        array_pop($dateArray);
//        $monthStr = implode('-', $dateArray);
//        $cache_name = 'salary_' . $vacation->island_id . '_' . $monthStr;
//        Cache::forget($cache_name);
//        $cache_name = 'salary_0_' . $monthStr;
//        Cache::forget($cache_name);
        CalculateSalary::dispatch($vacation);

    }

    /**
     * Handle the vacation "updated" event.
     *
     * @param  \App\Vacation  $vacation
     * @return void
     */
    public function updated(Vacation $vacation)
    {
//        $created = $vacation->created_at;
//        $date = explode(' ', $created)[0];
//        $dateArray = explode('-', $date);
//        array_pop($dateArray);
//        $monthStr = implode('-', $dateArray);
//        $cache_name = 'salary_' . $vacation->island_id . '_' . $monthStr;
//        Cache::forget($cache_name);
//        $cache_name = 'salary_0_' . $monthStr;
//        Cache::forget($cache_name);
        CalculateSalary::dispatch($vacation);

    }

    /**
     * Handle the vacation "deleted" event.
     *
     * @param  \App\Vacation  $vacation
     * @return void
     */
    public function deleted(Vacation $vacation)
    {
//        $created = $vacation->created_at;
//        $date = explode(' ', $created)[0];
//        $dateArray = explode('-', $date);
//        array_pop($dateArray);
//        $monthStr = implode('-', $dateArray);
//        $cache_name = 'salary_' . $vacation->island_id . '_' . $monthStr;
//        Cache::forget($cache_name);
//        $cache_name = 'salary_0_' . $monthStr;
//        Cache::forget($cache_name);
        CalculateSalary::dispatch($vacation);
    }

    /**
     * Handle the vacation "restored" event.
     *
     * @param  \App\Vacation  $vacation
     * @return void
     */
    public function restored(Vacation $vacation)
    {
        //
    }

    /**
     * Handle the vacation "force deleted" event.
     *
     * @param  \App\Vacation  $vacation
     * @return void
     */
    public function forceDeleted(Vacation $vacation)
    {
        //
    }
}
