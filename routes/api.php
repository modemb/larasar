<?php
// use App\Http\Controllers\Auth\ForgotPasswordController;
// use App\Http\Controllers\Auth\ResetPasswordController;
// use App\Http\Controllers\Auth\VerificationController;//EmailVerificationNotificationController
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
// use App\Models\User;

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

Route::apiResources([
  'users' => UserController::class,
  'pages' => PageController::class,
  'messages' => MessageController::class,
  'categories' => CategoryController::class,
  'notifications' => NotificationController::class, // Notifications
  // 'subscriptions' => PushSubscriptionController::class // Push Subscriptions
]);

// Push Subscriptions
Route::post('subscriptions', [PushSubscriptionController::class, 'update']);
Route::post('subscriptions/delete', [PushSubscriptionController::class, 'destroy']);

// Illuminate\Broadcasting\BroadcastController@authenticate
Route::post('/broadcasting/auth', [BroadcastController::class, 'authenticate']);

// if (!env('SANCTUM_API')) // env('SANCTUM_API') - config('sanctumApi')
Route::middleware(['auth:api'])->group(function () {
    Route::post('logout', [LoginController::class, 'logout']);
    // Route::post('email/resend', [VerificationController::class, 'resend']); env('SANCTUM_API')??
    // Route::post('email/verify/{id}/{hash}', [VerificationController::class, 'verify'])->name('verification.verify');
    Route::get('/user', function (Request $request) { // Disable Email Verify Route In Sanctum ^^^
      return array_merge($request->user()->toArray(), $request->user()->analytics->toArray());
    });
});

Route::middleware(['guest:api'])->group(function () {
    Route::post('login', [LoginController::class, 'loginApi']);
    Route::post('register', [RegisterController::class, 'register']);

    // Route::post('password/email', [ForgotPasswordController::class, 'sendResetLinkEmail']);
    // Route::post('password/reset', [ResetPasswordController::class, 'reset'])->name('password.reset');

    // Route::post('login/{driver}', [LoginController::class, 'redirect']);
    // Route::get('login/{driver}/callback', [LoginController::class, 'callback'])->name('oauth.callback');
});
