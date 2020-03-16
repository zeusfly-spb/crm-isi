<?php

namespace App\Jobs;

use App\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class AddEventToLead implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $appointment;
    protected $lead_id;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($lead_id, $appointment)
    {
        $this->lead_id = $lead_id;
        $this->appointment = $appointment->load('user');
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Lead::find($this->lead_id)->addAppointment($this->appointment);
    }
}
