<?php
// use App\Http\Controllers\Auth\ForgotPasswordController;
// use App\Http\Controllers\Auth\ResetPasswordController;
// use App\Http\Controllers\Auth\VerificationController;//EmailVerificationNotificationController
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\Auth\PushSubscriptionController;
use App\Http\Controllers\Auth\NotificationController;
use App\Http\Controllers\Auth\BroadcastController;
use App\Http\Controllers\Auth\MessageController;
// ==================================================== \\
// use Illuminate\Support\Facades\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
// use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/user', function (Request $request) {
  return $request->user();
})->middleware('auth:sanctum');

Route::apiResources([
  'users' => UserController::class,
  'pages' => PageController::class,
  'messages' => MessageController::class,
  'categories' => CategoryController::class,
  // 'notifications' => NotificationController::class, // Notifications
  // 'subscriptions' => PushSubscriptionController::class // Push Subscriptions
]);

// Push Subscriptions
Route::post('subscriptions', [PushSubscriptionController::class, 'update']);
Route::post('subscriptions/delete', [PushSubscriptionController::class, 'destroy']);

// Illuminate\Broadcasting\BroadcastController@authenticate
Route::post('/broadcasting/auth', [BroadcastController::class, 'authenticate']);

// if (!env('SANCTUM_API')) // env('SANCTUM_API') - config('sanctumApi')
$api = env('SANCTUM_API')?'sanctum:api':'auth:api';
Route::middleware(['sanctum:api'])->group(function () {
    Route::post('logout', [LoginController::class, 'logout']);
    // Route::post('email/resend', [VerificationController::class, 'resend']); //env('SANCTUM_API')??
    Route::post('email/verify/{id}/{hash}', [VerifyEmailController::class, 'verify']);//->name('verification.verify');
    // Route::post('email/verify/{id}/{hash}', [VerificationController::class, 'verify'])->name('verification.verify');
    Route::get('/user', function (Request $request) { // Disable Email Verify Route In Sanctum ^^^
      return array_merge($request->user()->toArray(), $request->user()->analytics->toArray());
    });
});

Route::get('login/{email}', [LoginController::class, 'callback']);

Route::middleware(['guest'])->group(function () {
    Route::post('login', [LoginController::class, 'loginApi']);
    Route::post('register', [RegisterController::class, 'register']);

    // Route::post('password/email', [ForgotPasswordController::class, 'sendResetLinkEmail']);
    // Route::post('password/reset', [ResetPasswordController::class, 'reset'])->name('password.reset');

    // Route::post('login/{driver}', [LoginController::class, 'redirect']);
    // Route::get('login/{driver}/callback', [LoginController::class, 'callback'])->name('oauth.callback');

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
    });//https://laravel.com/docs/10.x/sanctum#mobile-application-authentication
});

// require __DIR__.'/auth.php';

// Route::post('/broadcasting/auth', function (Request $request) {
//   return $request->user();
//     Auth::login(User::find(1), $remember = true);
// });//Illuminate\Broadcasting\BroadcastController@authenticate

// Notifications
// Route::post('notifications', [NotificationController::class, 'store']);
// Route::get('notifications', [NotificationController::class, 'index']);
// Route::patch('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
// Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllRead']);
// Route::post('notifications/{id}/dismiss', [NotificationController::class, 'dismiss']);

// Route::get('messages', [UserController::class, 'fetchMessages']);
// Route::post('messages', [UserController::class, "sendMessage"]);
