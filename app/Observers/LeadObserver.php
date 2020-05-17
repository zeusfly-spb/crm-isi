<?php

namespace App\Observers;

use App\Jobs\RefreshLeadsList;
use App\Lead;
use Illuminate\Support\Facades\Cache;

class LeadObserver
{
    /**
     * Handle the lead "created" event.
     *
     * @param  \App\Lead  $lead
     * @return void
     */
    public function created(Lead $lead)
    {
//        RefreshLeadsList::dispatch($lead, 'create');
    }

    /**
     * Handle the lead "updated" event.
     *
     * @param  \App\Lead  $lead
     * @return void
     */
    public function updated(Lead $lead)
    {
//        RefreshLeadsList::dispatch($lead, 'update');
        Cache::forget(today()->toDateString() . 'postpones_cache');
    }

    /**
     * Handle the lead "deleted" event.
     *
     * @param  \App\Lead  $lead
     * @return void
     */
    public function deleted(Lead $lead)
    {
//        RefreshLeadsList::dispatch($lead, 'delete');
        Cache::forget(today()->toDateString() . 'postpones_cache');
    }

    /**
     * Handle the lead "restored" event.
     *
     * @param  \App\Lead  $lead
     * @return void
     */
    public function restored(Lead $lead)
    {
        //
    }

    /**
     * Handle the lead "force deleted" event.
     *
     * @param  \App\Lead  $lead
     * @return void
     */
    public function forceDeleted(Lead $lead)
    {
        //
    }
}
