<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Model;
use Laravel\Cashier\Cashier;
use App\Models\User;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
      // Cashier::ignoreMigrations(); No more available
      Cashier::keepPastDueSubscriptionsActive();
      Cashier::keepIncompleteSubscriptionsActive();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
      // \Schema::defaultStringLength(191);

      // Cashier::calculateTaxes();
      Cashier::useCustomerModel(User::class);
      // Cashier::useSubscriptionModel(Subscription::class);
      // Cashier::useSubscriptionItemModel(SubscriptionItem::class);

      // https://laravel.com/docs/11.x/eloquent#configuring-eloquent-strictness
      Model::preventLazyLoading(! $this->app->isProduction());
      Model::preventSilentlyDiscardingAttributes(! $this->app->isProduction());
      // Model::shouldBeStrict(! $this->app->isProduction());
    }
}
