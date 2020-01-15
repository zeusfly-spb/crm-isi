<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class CacheController extends Controller
{
    protected $appModels = [
        'Access', 'CustomDoc', 'Customer', 'Deal', 'DealAction', 'DocumentPack', 'Expense', 'Forfeit', 'Group', 'HandOver',
        'Island', 'Lead', 'LeadComment', 'Phone', 'Postpone', 'Prepay', 'Prize', 'Setting', 'Sick', 'StartDay', 'TimeBreak',
        'User', 'Vacation', 'WorkDay', 'Service', 'Appointment'
    ];

    public  function cacheAll()
    {
        $start = microtime(true);
        foreach ($this->appModels as &$class) {
            $class = 'App\\' . $class;
            Cache::put((new $class)->getTable(), $class::all());
        }
        $finish = microtime(true);
        $elapsed = $finish - $start;
        return $elapsed;
    }

    /**
     * @param $item
     */
    public static function add(Model $model)
    {
        if (!Cache::has($model->getTable())) {
            return;
        }
        $data = Cache::get($model->getTable());
        $data->push($model);
        Cache::put($model->getTable(), $data);
    }

    public function update(Model $model)
    {
        if (!Cache::has($model->getTable())) {
            return;
        }
        $data = Cache::get($model->getTable());
        $data = $data->map(function ($item) use ($model) {
            return $item->id == $model->id ? $model : $item;
        });
        Cache::put($model->getTable(), $data);
    }

    public function delete(Model $model)
    {
        if (!Cache::has($model->getTable())) {
            return;
        }
        $data = Cache::get($model->getTable());
        $data = $data->reject(function ($item) use ($model) {
            return $item->id == $model->id;
        });
        Cache::put($model->getTable(), $data);
    }
}
