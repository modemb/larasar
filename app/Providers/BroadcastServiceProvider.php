<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $api = config('sanctumApi')?[]:['middleware' => 'api']; // env('SANCTUM_API') - config('sanctumApi')
        Broadcast::routes($api);

        require base_path('routes/channels.php');
    }
}
