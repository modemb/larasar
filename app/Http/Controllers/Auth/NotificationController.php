<?php

namespace App\Http\Controllers\Auth;

use App\Events\NotificationRead;
use App\Events\NotificationReadAll;
use App\Notifications\MessageNotification;
use App\Notifications\HelloNotification;
use Illuminate\Http\Request;
use NotificationChannels\WebPush\PushSubscription;
// use App\Http\Controllers\Controller; // Added
use Illuminate\Routing\Controller; // Added

class NotificationController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
      if (config('sanctumApi')) $this->middleware('auth:sanctum')->except('last', 'dismiss');
      else $this->middleware('auth:api')->except('last', 'dismiss'); // env('SANCTUM_API') - config('sanctumApi')
    }

    /**
     * Get user's notifications.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {  //return $request;
        $user = $request->user();

        // Limit the number of returned notifications, or return all
        $query = $user->unreadNotifications();
        $limit = (int) $request->input('limit', 0);
        if ($limit) $query = $query->limit($limit);

        $Notifications = $query->get()->each(function ($n) {
            $n->created = $n->created_at->toIso8601String();
        }); $Total = $user->unreadNotifications->count();

        return compact('Notifications', 'Total');
    }

    /**
     * Create a new notification.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if ($request->notify) { // Send Notification
          // $request->user()->notify(new HelloNotification);
          $request->user()->notify(new MessageNotification);

          return response()->json('Notification sent.', 201);
        } elseif ($request->mark_all_read) { // markAllRead
          $request->user()
                  ->unreadNotifications()
                  ->get()->each(function ($n) {
                      $n->markAsRead();
                  });

          event(new NotificationReadAll($request->user()->id));
          return response()->json('markAllRead', 201);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    { //return $id;

      if ($request->read) {
        $notification = $request->user()
        ->unreadNotifications()
        ->where('id', $id)
        ->first();

        if (is_null($notification)) return response()->json('Notification not found.', 404);

        $notification->markAsRead(); // markAsRead

        event(new NotificationRead($request->user()->id, $id));
        return response()->json('markAsRead', 201);
      } elseif ($request->dismiss) {
        if (empty($request->endpoint)) return response()->json('Endpoint missing.', 403);

        $subscription = PushSubscription::findByEndpoint($request->endpoint);
        if (is_null($subscription)) return response()->json('Subscription not found.', 404);

        $notification = $subscription->subscribable->notifications()->where('id', $id)->first();
        if (is_null($notification)) return response()->json('Notification not found.', 404);

        $notification->markAsRead(); // Dismissed

        event(new NotificationRead($subscription->subscribable->id, $id));
        return response()->json('dismissed', 201);
      }
    }

    /**
     * Mark user's notification as read.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function markAsRead(Request $request, $id)
    {
        // $notification = $request->user()
        //                         ->unreadNotifications()
        //                         ->where('id', $id)
        //                         ->first();

        // if (is_null($notification)) {
        //     return response()->json('Notification not found.', 404);
        // }

        // $notification->markAsRead();

        // event(new NotificationRead($request->user()->id, $id));
    }

    /**
     * Mark all user's notifications as read.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function markAllRead(Request $request)
    {
        // $request->user()
        //         ->unreadNotifications()
        //         ->get()->each(function ($n) {
        //             $n->markAsRead();
        //         });

        // event(new NotificationReadAll($request->user()->id));
    }

    /**
     * Mark the notification as read and dismiss it from other devices.
     *
     * This method will be accessed by the service worker
     * so the user is not authenticated and it requires an endpoint.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function dismiss(Request $request, $id)
    {
        // if (empty($request->endpoint)) {
        //     return response()->json('Endpoint missing.', 403);
        // }

        // $subscription = PushSubscription::findByEndpoint($request->endpoint);
        // if (is_null($subscription)) {
        //     return response()->json('Subscription not found.', 404);
        // }

        // $notification = $subscription->subscribable->notifications()->where('id', $id)->first();
        // if (is_null($notification)) {
        //     return response()->json('Notification not found.', 404);
        // }

        // $notification->markAsRead();

        // event(new NotificationRead($subscription->subscribable->id, $id));
    }
}
