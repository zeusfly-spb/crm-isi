<?php

namespace App\Observers;

use App\LeadComment;
use Illuminate\Support\Facades\Cache;
use App\Jobs\RefreshLeadsList;

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
        RefreshLeadsList::dispatch($leadComment, 'create');
    }

    /**
     * Handle the lead comment "updated" event.
     *
     * @param  \App\LeadComment  $leadComment
     * @return void
     */
    public function updated(LeadComment $leadComment)
    {
        RefreshLeadsList::dispatch($leadComment, 'update');
    }

    /**
     * Handle the lead comment "deleted" event.
     *
     * @param  \App\LeadComment  $leadComment
     * @return void
     */
    public function deleted(LeadComment $leadComment)
    {
        RefreshLeadsList::dispatch($leadComment, 'delete');
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
