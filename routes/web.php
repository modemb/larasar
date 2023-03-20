<?php
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

use App\Http\Controllers\Auth\PushSubscriptionController;
use App\Http\Controllers\Auth\NotificationController;
use App\Http\Controllers\Auth\MessageController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::resources([
  // 'users' => UserController::class,
  'messages' => MessageController::class,
  'notifications' => NotificationController::class, // Notifications
  // 'subscriptions' => PushSubscriptionController::class // Push Subscriptions
]);

if (env('JETSTREAM_FRONTEND')) { // Inertia/Livewire Demo

  Route::get('/', function () {
    $data = [ // Inertia Or Livewire Stack
      'canLogin' => Route::has('login'),
      'canRegister' => Route::has('register'),
      'laravelVersion' => Application::VERSION,
      'phpVersion' => PHP_VERSION,
    ];return env('LIVEWIRE') ? view('welcome', $data) : Inertia::render('Welcome', $data);
  });

  Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
  ])->group(function () {
      Route::get('/dashboard', function () {
        return env('LIVEWIRE') ? view('dashboard') : Inertia::render('Dashboard');
      })->name('dashboard');
  }); return;

} elseif (env('SANCTUM_API')) Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
  return array_merge($request->user()->toArray(), $request->user()->analytics->toArray());
});// env('SANCTUM_API') - config('sanctumApi')
