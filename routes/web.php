<?php
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

use App\Http\Controllers\Auth\LoginController;

use App\Http\Controllers\Auth\PushSubscriptionController;
use App\Http\Controllers\Auth\NotificationController;
use App\Http\Controllers\Auth\BroadcastController;
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

Route::apiResources([
  'users' => UserController::class,
  'messages' => MessageController::class,
  'notifications' => NotificationController::class, // Notifications
  // 'subscriptions' => PushSubscriptionController::class // Push Subscriptions
]);

if (env('JETSTREAM_FRONTEND')) { // Inertia/Livewire Demo

  Route::get('/', function () {
    $data = [
      'canLogin' => Route::has('login'),
      'canRegister' => Route::has('register'),
      'laravelVersion' => Application::VERSION,
      'phpVersion' => PHP_VERSION,
    ];if (env('LIVEWIRE')) return view('welcome', $data);
    else return Inertia::render('Welcome', $data);
  });

  Route::middleware(['auth:sanctum', 'verified'])->get('/dashboard', function () {
      if (env('LIVEWIRE')) return view('dashboard');
      else return Inertia::render('Dashboard');
  })->name('dashboard');

} elseif (env('SANCTUM_API')) Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
  // return $request->user(); // return $request->user()->with('analytics');
  return array_merge($request->user()->toArray(), $request->user()->analytics->toArray());
}); // env('SANCTUM_API') - config('sanctumApi')

Route::middleware(['guest'])->group(function () { // Suguffiè Application

  Route::get('/login', function () {
      return view('index');
  });

  Route::get('/register', function () {
      return view('index');
  });

  // Route::get('api/password/reset', function () {
  //     return view('index');
  // });

  // Route::get('/password/reset/{token}', function () {
  //     return view('index');
  // });

  Route::post('api/login/{driver}', [LoginController::class, 'redirect']);
  Route::get('api/login/{driver}/callback', [LoginController::class, 'callback'])->name('oauth.callback');

});

// Route::get('/api/email/verify/{id}/{hash}', function () {
//     return view('index');
// });

// Route::get('/email/verify/{id}/{hash}', function () {
//     return view('index');
// });

// Route::get('/post/{id}', function () {
//     return view('index');
// });

Route::get('/email/verify', function () {
    return view('index');
});

// ==================================================================================

// Manifest file (optional if VAPID is used)
// Route::get('manifest.json', function () {
//   return [
//       'name' => config('app.name'),
//       'gcm_sender_id' => config('webpush.gcm.sender_id'),
//   ];
// });

Route::get('{path}', function () {
    return view('index');
})->where('path', '.*');

// require __DIR__.'/auth.php';

// =====================Test============================
Route::get('/test', function () {
  return env('SANCTUM_API').' - '.config('sanctumApi');
});
Route::get('/billing-portal', function (Request $request) {
  return $request->user()->redirectToBillingPortal();
});
Route::post('/tokens/create', function (Request $request) {
  $token = $request->user()->createToken($request->token_name);

  // return $token->plainTextToken;
  return ['token' => $token->plainTextToken];
});// https://laravel.com/docs/9.x/sanctum#issuing-api-tokens

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

Route::post('/sanctum/token', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        'device_name' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    } return $user->createToken($request->device_name)->plainTextToken;
});//https://laravel.com/docs/9.x/sanctum#mobile-application-authentication
// =====================Test End========================
