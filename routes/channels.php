<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('App.Models.Room.{id}', function ($room, $id) {
  return (int) $room->id === (int) $id;
});

// Broadcast::channel('chat', function ($user) {
//   // return Auth::check();
//   return true;
// });

// Broadcast::channel('App.Models.Room.{post_id}', function ($room, $post_id) {
//   // return true;
//   return (int) $room->post_id === (int) $post_id;
// });

// Broadcast::channel('chat', function ($user, $id) {
//     // return (int) $user->id === (int) $id;
//     return 1;
// });

// Broadcast::channel('App.Models.User.{id}', function () {
//     return true;
// });

// Broadcast::channel('chat', function () {
//   return true;
// });

// Broadcast::routes(['middleware' => ['auth:sanctum']]); // https://laravel.com/docs/8.x/sanctum#authorizing-private-broadcast-channels
