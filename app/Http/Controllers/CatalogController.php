<?php

namespace App\Http\Controllers;

use App\NotifyTemplate;
use App\Service;
use App\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;

class CatalogController extends Controller
{
    public function createNotifyTemplate(Request $request)
    {
        $template = NotifyTemplate::create($request->all());
        return response()->json($template->toArray());
    }

    public function getCatalogs()
    {
        $services = Cache::rememberForever('services', function () {
            return Service::all();
        });
        $subscriptions = Subscription::with('service')->get();
        $notifyTemplates = NotifyTemplate::all();
        return response()->json([
            'services' => $services->toArray(),
            'subscriptions' => $subscriptions->toArray(),
            'notify_templates' => $notifyTemplates->toArray()
        ]);
    }

    public function createService(Request $request)
    {
        $service = Service::create($request->all());
        Cache::forget('services');
        return response()->json($service->toArray());
    }

    public function updateService(Request $request)
    {
        $service = Service::find($request->id);
        $inputs = Arr::except($request->all(), ['id']);
        $service->update($inputs);
        return response()->json($service->toArray());
    }

    public function deleteService(Request $request)
    {
        return response()->json(['result' => Service::destroy($request->id)]);
    }

    public function createSubscription(Request $request)
    {
        $subscription = Subscription::create($request->all());
        $subscription->load('service');
        return response()->json($subscription->toArray());
    }

    public function deleteSubscription(Request $request)
    {
        $subscription = Subscription::find($request->subscription_id);
        return response()->json(['result' => $subscription->delete()]);
    }

    public function updateSubscription(Request $request)
    {
        $subscription = Subscription::find($request->id);
        $inputs = Arr::except($request->all(), ['id', 'service']);
        $subscription->update($inputs);
        $subscription->load('service');
        return response()->json($subscription->toArray());
    }
}
