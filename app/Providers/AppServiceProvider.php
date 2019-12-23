<?php

namespace App\Providers;

use App\DocumentPack;
use App\Observers\UserObserver;
use App\User;
use Illuminate\Support\ServiceProvider;
use App\Observers\DocPackObserver;
use App\Deal;
use App\Observers\DealObserver;

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
        DocumentPack::observe(DocPackObserver::class);
        User::observe(UserObserver::class);
        Deal::observe (DealObserver::class);
    }
}
