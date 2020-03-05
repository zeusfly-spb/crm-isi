<?php

namespace App\Providers;

use App\DocumentPack;
use App\Observers\UserObserver;
use App\User;
use Carbon\Carbon;
use Illuminate\Support\ServiceProvider;
use App\Observers\DocPackObserver;
use App\Deal;
use App\Observers\DealObserver;
use App\Prepay;
use App\Observers\PrepayObserver;
use App\Prize;
use App\Observers\PrizeObserver;
use App\Sick;
use App\Observers\SickObserver;
use App\Vacation;
use App\Observers\VacationObserver;
use App\WorkDay;
use App\Observers\WorkDayObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        setlocale(LC_TIME, 'ru_RU.UTF-8');
        Carbon::setLocale(config('app.locale'));
        DocumentPack::observe(DocPackObserver::class);
        User::observe(UserObserver::class);
        Deal::observe (DealObserver::class);
        Prepay::observe(PrepayObserver::class);
        Prize::observe(PrizeObserver::class);
        Sick::observe(SickObserver::class);
        Vacation::observe(VacationObserver::class);
        WorkDay::observe(WorkDayObserver::class);
    }
}
