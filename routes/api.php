<?php

use Illuminate\Http\Request;

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

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();

// });

Route::group(['middleware' => 'auth:api'], function () {
    // Route::post('logout', 'Auth\LoginController@logout');
    Route::get('/user', function (Request $request) {
<<<<<<< HEAD
        return $request->user();
=======
      return $request->user();
>>>>>>> modemb/dev
    });

    // Route::patch('settings/profile', 'Settings\ProfileController@update');
    // Route::patch('settings/password', 'Settings\PasswordController@update');
<<<<<<< HEAD
    Route::post('logout', 'Auth\LoginController@logout');
=======
>>>>>>> modemb/dev
    Route::apiResources([
      'users' => 'UserController'
    ]);
});

Route::group(['middleware' => 'guest:api'], function () {
<<<<<<< HEAD
    Route::post('login', 'UserController@store');
    // Route::post('register', 'UserController@store');
=======

    Route::apiResources([
      'users' => 'UserController'
    ]);
>>>>>>> modemb/dev

    // Route::post('login', 'Auth\LoginController@login');
    Route::post('register', 'Auth\RegisterController@register');

    Route::post('password/email', 'Auth\ForgotPasswordController@sendResetLinkEmail');
    Route::post('password/reset', 'Auth\ResetPasswordController@reset');

    Route::post('email/verify/{user}', 'Auth\VerificationController@verify')->name('verification.verify');
    Route::post('email/resend', 'Auth\VerificationController@resend');

<<<<<<< HEAD
    Route::post('oauth/{driver}', 'Auth\OAuthController@redirectToProvider');
    Route::get('oauth/{driver}/callback', 'Auth\OAuthController@handleProviderCallback')->name('oauth.callback');
=======
    // Route::post('oauth/{driver}', 'Auth\OAuthController@redirectToProvider');
    // Route::get('oauth/{driver}/callback', 'Auth\OAuthController@handleProviderCallback')->name('oauth.callback');
>>>>>>> modemb/dev
});
