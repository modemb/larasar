<?php

namespace App\Providers;

use App\Models\Team;
use App\Policies\TeamPolicy;
use Laravel\Passport\Passport;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Team::class => TeamPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // $this->registerPolicies();

        // if (! $this->app->routesAreCached()) {
        //     Passport::routes();
        // }   //Passport::routes();
        // Passport::loadKeysFrom(__DIR__.'/../secrets/oauth');
    }
}
