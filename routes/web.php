<?php
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

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

});

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
