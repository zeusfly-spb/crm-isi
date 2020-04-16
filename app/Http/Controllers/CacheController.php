<?php

namespace App\Http\Controllers;

use App\Lead;
use App\LeadComment;
use App\Postpone;
use App\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

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

    public static function createActiveLeadsCache()
    {
        function type1 () {
            $leads = Lead::with('user')->where('status', '<>', 'done')->get();
            $comments = LeadComment::whereIn('lead_id', $leads->pluck('id')->all())->get();
            $postpones = Postpone::whereIn('lead_id', $leads->pluck('id')->all())->get();

            $leads->each(function ($item) {
                Redis::set("lead:$item->id", json_encode($item->toArray()));
                Redis::set("lead:$item->id:user", $item->user ? json_encode($item->user->toArray()) : null);
            });

            $comments->each(function ($item) {
                Redis::rpush("lead:$item->lead_id:comments", json_encode($item->toArray()));
            });

            $postpones->each(function ($item) {
                Redis::rpush("lead:$item->lead_id:postpones", json_encode($item->toArray()));
            });
        }

        function type2 () {
            $leads = Lead::where('status', '<>', 'done')->get();
            $leads->each(function ($lead) {
                $name = 'lead:' . $lead->id;

                $att = $lead->getAttributes();
                foreach ($att as $key => $value) {
                    Redis::command('HSET', ['temp', $key, $value]);
                }
                Redis::command('RENAME', ['temp', $name]);

                $comments = LeadComment::with('user')
                    ->where('lead_id', $lead->id)->get();
                if ($comments->count()) {
                    $comments->each(function ($comment) {
                        Redis::command('RPUSH', ['temp', json_encode($comment->toArray())]);
                    });
                    $commentsName = $name . ':comments';
                    Redis::command('RENAME', ['temp', $commentsName]);
                }

                $postpones = Postpone::with('user')
                    ->where('lead_id', $lead->id)->get();
                if ($postpones->count()) {
                    $postpones->each(function ($postpone) {
                        Redis::command('RPUSH', ['temp', json_encode($postpone->toArray())]);
                    });
                    $postponesName = $name . ':postpones';
                    Redis::command('RENAME', ['temp', $postponesName]);
                }

                if ($lead->user_id) {
                    Redis::command('SET', [$name . ':user', json_encode(User::find($lead->user_id)->toArray())]);
                }
            });
        }

        $start = microtime(true);
        type2();
        $finish = microtime(true);
        $elapsed = $finish - $start;
        return $elapsed;
    }
}
