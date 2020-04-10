<?php

namespace App\Observers;

use App\LeadComment;
use Illuminate\Support\Facades\Cache;

class LeadCommentObserver
{
    /**
     * Handle the lead comment "created" event.
     *
     * @param  \App\LeadComment  $leadComment
     * @return void
     */
    public function created(LeadComment $leadComment)
    {
        Cache::forget('leads_list');

    }

    /**
     * Handle the lead comment "updated" event.
     *
     * @param  \App\LeadComment  $leadComment
     * @return void
     */
    public function updated(LeadComment $leadComment)
    {
        Cache::forget('leads_list');
    }

    /**
     * Handle the lead comment "deleted" event.
     *
     * @param  \App\LeadComment  $leadComment
     * @return void
     */
    public function deleted(LeadComment $leadComment)
    {
        Cache::forget('leads_list');
    }

    /**
     * Handle the lead comment "restored" event.
     *
     * @param  \App\LeadComment  $leadComment
     * @return void
     */
    public function restored(LeadComment $leadComment)
    {
        //
    }

    /**
     * Handle the lead comment "force deleted" event.
     *
     * @param  \App\LeadComment  $leadComment
     * @return void
     */
    public function forceDeleted(LeadComment $leadComment)
    {
        //
    }
}
