<?php

namespace App\Observers;

use App\User;
use App\Jobs\UpdateUser;
use Illuminate\Support\Facades\Cache;

class UserObserver
{
    /**
     * Handle the user "created" event.
     *
     * @param  \App\User  $user
     * @return void
     */
    public function created(User $user)
    {
        $user->createDocumentPack();
        $user->load('documentPack');
    }

    /**
     * Handle the user "updated" event.
     *
     * @param  \App\User  $user
     * @return void
     */
    public function updated(User $user)
    {
        $rateMonths = [];
        foreach ($user->rates as $rate) {
            $rateMonths[] = $rate['month'];
        }
        $rateMonths = array_unique($rateMonths);
        $islandIds = $user->islands->pluck('id')->all();
        foreach ($islandIds as $islandId) {
            foreach ($rateMonths as $month) {
                $cache_name = 'salary_' . $islandId . '_' . $month;
                Cache::forget($cache_name);
            }
        }
        Cache::forget('salary_0_' . $month);
    }

    /**
     * Handle the user "deleted" event.
     *
     * @param  \App\User  $user
     * @return void
     */
    public function deleting(User $user)
    {
        $user->documentPack->delete();
    }

    /**
     * Handle the user "restored" event.
     *
     * @param  \App\User  $user
     * @return void
     */
    public function restored(User $user)
    {
        //
    }

    /**
     * Handle the user "force deleted" event.
     *
     * @param  \App\User  $user
     * @return void
     */
    public function forceDeleted(User $user)
    {
        //
    }
}
