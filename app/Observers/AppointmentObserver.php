<?php

namespace App\Observers;

use App\Appointment;
use App\Island;
use App\NotifyTemplate;

class AppointmentObserver
{
    /**
     * Handle the appointment "created" event.
     *
     * @param  \App\Appointment  $appointment
     * @return void
     */
    public function created(Appointment $appointment)
    {
        $island = Island::find($appointment->island_id);
        if (!$island->create_notify_template_id) {
            return;
        }
        $template = NotifyTemplate::find($island->create_notify_template_id);
        if (!$template) {
            return;
        }
        sendSms([
            'extension' => 951,
            'island_id' => $appointment->island_id,
            'user_id' => 0,
            'phone' => '+7' . $appointment->client_phone,
            'text' => substituteEventText($template->text, $appointment)
        ]);
    }

    /**
     * Handle the appointment "updated" event.
     *
     * @param  \App\Appointment  $appointment
     * @return void
     */
    public function updated(Appointment $appointment)
    {
        //
    }

    /**
     * Handle the appointment "deleted" event.
     *
     * @param  \App\Appointment  $appointment
     * @return void
     */
    public function deleted(Appointment $appointment)
    {
        //
    }

    /**
     * Handle the appointment "restored" event.
     *
     * @param  \App\Appointment  $appointment
     * @return void
     */
    public function restored(Appointment $appointment)
    {
        //
    }

    /**
     * Handle the appointment "force deleted" event.
     *
     * @param  \App\Appointment  $appointment
     * @return void
     */
    public function forceDeleted(Appointment $appointment)
    {
        //
    }
}
