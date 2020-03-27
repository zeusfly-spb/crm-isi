<?php

namespace App\Observers;

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
        Cache::forget('leads_list');
    }

    /**
     * Handle the lead "updated" event.
     *
     * @param  \App\Lead  $lead
     * @return void
     */
    public function updated(Lead $lead)
    {
        Cache::forget('leads_list');
    }

    /**
     * Handle the lead "deleted" event.
     *
     * @param  \App\Lead  $lead
     * @return void
     */
    public function deleted(Lead $lead)
    {
        Cache::forget('leads_list');
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
