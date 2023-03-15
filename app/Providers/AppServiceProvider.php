<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Model;
use Laravel\Cashier\Cashier;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
      Cashier::ignoreMigrations();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
      // \Schema::defaultStringLength(191);
      Cashier::calculateTaxes();
      Cashier::useSubscriptionModel(Subscription::class);
      Cashier::useSubscriptionItemModel(SubscriptionItem::class);
      // https://laravel.com/docs/9.x/eloquent#configuring-eloquent-strictness
      Model::shouldBeStrict(! $this->app->isProduction());
    }
}
