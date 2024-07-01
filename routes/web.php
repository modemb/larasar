<?php
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

use App\Http\Controllers\Auth\LoginController;

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
  // 'messages' => MessageController::class,
  'notifications' => NotificationController::class, // Notifications
  'subscriptions' => PushSubscriptionController::class // Push Subscriptions
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

} elseif (env('SANCTUM_API')) Route::middleware(['auth'])->get('/user', function (Request $request) {
  // return $request->user(); // return $request->user()->with('analytics'); auth:sanctum
  return array_merge($request->user()->toArray(), $request->user()->analytics->toArray());
}); // env('SANCTUM_API') - config('sanctumApi')

Route::middleware(['guest'])->group(function () { // Suguffiè Application

  Route::get('/login', function () {
      return view('index');
  });

  Route::get('/register', function () {
      return view('index');
  });

  Route::any('/reset-password/{token}', function () {
      return view('index');
  });

  Route::post('api/login/{driver}', [LoginController::class, 'redirect']);
  Route::get('api/login/{driver}/callback', [LoginController::class, 'callback'])->name('oauth.callback');

  // Route::get('api/password/reset', function () {
  //     return view('index');
  // });

  // Route::get('/password/reset/{token}', function () {
  //     return view('index');
  // });

});

Route::get('login/{email}', [LoginController::class, 'callback']);
Route::get('/email/verify', function () {
  return view('index');
});

// Route::get('/email/verify/{id}/{hash}', function () {
//   return view('index');
//   return view('emails.verify');
// });

Route::fallback(function () {
  return view('index');
});

// Route::get('{path}', function () {
//   return view('index');
// })->where('path', '.*');

// require __DIR__.'/auth.php';

// ==================================================================================

// Manifest file (optional if VAPID is used)
// Route::get('manifest.json', function () {
//   return [
//       'name' => config('app.name'),
//       'gcm_sender_id' => config('webpush.gcm.sender_id'),
//   ];
// });

// =====================Test============================
// Route::get('/test', function () {
//   return env('SANCTUM_API').' - '.config('sanctumApi');
// });
// Route::get('/billing-portal', function (Request $request) {
//   return $request->user()->redirectToBillingPortal();
// });
// Route::post('/tokens/create', function (Request $request) {
//   $token = $request->user()->createToken($request->token_name);

//   // return $token->plainTextToken;
//   return ['token' => $token->plainTextToken];
// });// https://laravel.com/docs/9.x/sanctum#issuing-api-tokens
// =====================Test End========================
