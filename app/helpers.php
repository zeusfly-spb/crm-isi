<?php
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use GuzzleHttp\Client;

function sendSms (array $data) {
    $client = new Client();
    $res = $client->request('POST', 'https://crmkin.ru/tel/api/vpbx/sms/send', [
        'form_params' => [
            'base_type' => 'isi',
            'user_id' => $data['user_id'],
            'extension' => $data['extension'],
            'phone' => $data['phone'],
            'text' => $data['text']
        ]
    ]);
    return $res->getStatusCode();
}

function clearPostponesCache () {
    Cache::forget('call_today_' . today()->toDateString());
}

function cacheModel (Model $model, string $prefix = '')
{
    foreach ($model->getAttributes() as $key => $value) {
        Redis::command('HSET', [$prefix ?? class_basename($model), $key, $value]);
    }
    return $model;
}

function cacheRelation (Model $model, string $relation)
{
    if (getRelType($model, $relation) == 'Collection') {
        foreach ($model->$relation as $item) {
            cacheModel($item, class_basename($model) . "$model->id:$relation:$item->id");
        }
    } else {
        cacheModel($model->$relation, class_basename($model) . "$model->id:$relation:{$model->$relation}->id");
    }
}

function pullOut (string $model, $id, array $options = [])
{
        $result = Redis::command('HGETALL', "$model:$id");
        return $result;
}

function getRelType (Model $model, string $relation)
{
    $item = $model->$relation;
    return class_basename($item);
}
