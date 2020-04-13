<?php

namespace App\Jobs;

use App\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Model;


class RefreshLeadsList implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $model;
    protected $operation;
    protected $lead_id;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Model $model, string $operation)
    {
        $this->model = $model;
        $this->operation = $operation;
        if (get_class($this->model) == 'App\Lead') {
            $this->lead_id = $this->model->id;
        } else {
            $this->lead_id = $this->model->lead_id;
        }
    }

    protected function commonUpdate ($data) {
        $leadId = $this->lead_id;
        $newItem = Lead::with('comments', 'user', 'postpones')->find($leadId)->toArray();
        $data = $data->map(function ($item) use ($leadId, $newItem) {
            return $item->id == $leadId ? $newItem : $item;
        });
        return $data;
    }

    protected function updateLeadInfo () {
        $leadId = $this->lead_id;
        $cacheData = Cache::get('leads_list');
        switch ($this->operation) {
            case 'update':
                $cacheData = $this->commonUpdate($cacheData);
                break;
            case 'create':
                if (get_class($this->model) == 'App\Lead') {
                    $newItem = $this->model->load('user')->toArray();
                    $cacheData = $cacheData->map(function ($item) use ($leadId, $newItem) {
                        return $item->id == $leadId ? $newItem : $item;
                    });
                } else {
                    $cacheData = $this->commonUpdate($cacheData);
                }
                break;
            case 'delete':
                if (get_class($this->model) == 'App\Lead') {
                    $cacheData = $cacheData->filter(function ($item) use ($leadId) {
                        return $item->id !== $leadId;
                    });
                } else {
                    $cacheData = $this->commonUpdate($cacheData);
                }
                break;
        }
        Cache::put('leads_list', $cacheData);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
//        $leads = Lead::with('comments', 'user', 'postpones')
//            ->where('status', '<>', 'done')
//            ->get()->reverse()->values()->toArray();
//        Cache::put('leads_list', $leads);
        $this->updateLeadInfo();
    }
}
