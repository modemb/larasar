<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $api = config('sanctumApi')?[]:['middleware' => 'api'];
        Broadcast::routes($api); // env('SANCTUM_API') - config('sanctumApi')

        require base_path('routes/channels.php');
    }
}
