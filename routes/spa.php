<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| SPA Routes
|--------------------------------------------------------------------------
|
| Here is where you can register SPA routes for your frontend. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "spa" middleware group.
|
*/

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

  // Route::get('api/password/reset', function () {
  //     return view('index');
  // });

  // Route::get('/password/reset/{token}', function () {
  //     return view('index');
  // });

  // Route::post('api/login/{driver}', [LoginController::class, 'redirect']);
  // Route::get('api/login/{driver}/callback', [LoginController::class, 'callback'])->name('oauth.callback');

});

Route::get('/email/verify', function () {
  return view('index');
});

Route::get('{path}', function () {
  return view('index');
})->where('path', '.*');
