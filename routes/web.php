<?php

use Illuminate\Support\Facades\Route;

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

if(env('MUST_VERIFY_EMAIL')){
  $verified = 'verified';
  $verify = ['verify' => true];
} else $verify = $verified = [];

Auth::routes($verify);

// Route::get('/', function () {
//   // return view('welcome');
//   return view('index');
// });

Route::get('/home', 'HomeController@index')
  // ->middleware($verified)
  ->name('home');

Route::group(['middleware' => 'guest'], function () {
  Route::any('/login', function () {
    return view('index');
  });

  Route::get('/register', function () {
    return view('index');
  });

  Route::get('/password/reset', function () {
    return view('index');
  });
});

Route::get('api/email/verify/{id}/{hash}', function () {
  return view('index');
});

Route::get('email/verify/{id}/{hash}', function () {
  return view('index');
});

// Route::get('email/verify', function () {
//   return view('index');
// });//ToFixVerifyLink

Route::get('{path}', function () {
  // return view('welcome');
  return view('index');
})->where('path', '.*')->middleware($verified);
