<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Lead;

class ConvertLeadEvents extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'convert:events';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Modifying Lead models to have just one Appointment';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $convertedCount = 0;
        $start = microtime(true);
        $leads = Lead::all();
        $toModify = [];
        $leads->each(function ($lead) {
            if ($lead->appointments->count() > 1) {
                $toModify[] = $lead;
            }
        });
        if (count($toModify)) foreach ($toModify as $item) {
            $item->update(['appointment_id' => $item->appointments[count($item->appointments) - 1]]);
            ++$convertedCount;
        }
        $finish = microtime(true);
        $estimated = $finish - $start;
        $this->info("Converted $convertedCount leads in $estimated sec.");
    }
}
