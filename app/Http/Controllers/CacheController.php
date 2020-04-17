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
        function perform () {
            Redis::command('DEL', ['active_leads']);
            $leads = Lead::where('status', '<>', 'done')->get();

            $leads->each(function ($lead) {
                Redis::command('RPUSH', ['active_leads', $lead->id]);

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
                } else {
                    Redis::command('SET', [$name . ':user', '']);
                }
            });
        }
        $start = microtime(true);
        perform();
        $finish = microtime(true);
        $elapsed = $finish - $start;
        return $elapsed;
    }

    public static function getActiveLeadsCache()
    {
        function attachComments ($lead) {
            $id = $lead['id'];
            $comments = [];
            $commentJsons = Redis::command('LRANGE', ["lead:$id:comments", 0, -1]);
            if (count($commentJsons)) {
                foreach ($commentJsons as $item) {
                    $comments[] = json_decode($item);
                }
            }
            $lead['comments'] = $comments;
            return $lead;
        }
        function attachPostpones ($lead) {
            $id = $lead['id'];
            $postpones = [];
            $postponeJsons = Redis::command('LRANGE', ["lead:$id:postpones", 0, -1]);
            if (count($postponeJsons)) {
                foreach ($postponeJsons as $item) {
                    $postpones[] = json_decode($item);
                }
            }
            $lead['postpones'] = $postpones;
            return $lead;
        }
        function attachRelations ($lead) {
            $id = $lead['id'];
            $userJson = Redis::command('GET', ["lead:$id:user"]);
            $lead['user'] = json_decode($userJson);
            $lead = attachPostpones(attachComments($lead)) ;
            return $lead;
        }

        $ids = Redis::command('LRANGE', ['active_leads', 0, -1]);
        $leads = [];
        foreach ($ids as $id) {
            $leads[] = attachRelations(Redis::command('HGETALL', ["lead:$id"]));
        }
        return $leads;
    }
}
