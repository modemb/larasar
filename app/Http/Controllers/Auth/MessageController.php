<?php

namespace App\Http\Controllers\Auth;

use App\Notifications\MessageNotification;
// use App\Http\Controllers\Controller;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use App\Events\MessageSent;
use App\Mail\InfoSuguffie;
use App\Models\Message;
use App\Models\Chat;
use App\Models\Room;
use App\Models\User;
use DB;

/**
 * Tags: MessageModule
 *
 * @to Chat.vue
 */
class MessageController extends Controller
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
      // $this->middleware('auth')->except('last', 'dismiss');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      $auth = $request->user(); // $auth = collect($auth)->forget('posts');

      if ($message = $request->input('message')) {

        $messageTrashed = Message::onlyTrashed()->first();

        if ($messageTrashed) $messageTrashed->restore();

        $chatMessage = $messageTrashed ?? new Message;

        $chatMessage->room_id = $request->room_id;
        $chatMessage->user_id = $auth->id;
        $chatMessage->message = $message;
        $chatMessage->save();

      }// event(new MessageSent($auth->id, $chat->room_id, $request->typing, $chat->message));

      broadcast(new MessageSent($auth->id, $request->room_id, $message, $request->typing, $request->received))->toOthers();

      $roomId = $request->room_id??$request->emailRoomId;

      foreach (Chat::where('room_id', $roomId)->get() as $chat)
      if ($chat->user_id !== $auth->id) try {
        $user = User::find($chat->user_id);

        app()->setLocale($user->locale); $content = [
          'subject' => 'You Received a Message',
          'title' => $request->emailMessage,
          'body' => 'Please click the button below to access the chat',
          'button' => 'Click Here', // App::setLocale($locale);
          'url' => env('API_URL').'/chat/'.$request->emailRoomId
          // 'url' => env('DEV_URL').'/chat/'.$request->emailRoomId
        ]; /* return $content; //Send Notifications To ChatRoom's Users */
        if ($request->notReceived) \Mail::to($user->email)->send(new InfoSuguffie($content));
        if ($message) $user->notify(new MessageNotification);
      } catch (\Throwable $th) {throw $th;/*  */}

      return [
        'status' => 'Message Sent! room'.$roomId,
        'auth' => $auth, 'authId' => $auth->id,
        'received' => $request->received,
        'message' => $message,
        'notReceived' => $request->notReceived,
        'emailMessage' => $request->emailMessage,
        'emailRoomId' => $request->emailRoomId
      ]; // TagStore: MessageModule

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
      $chats = Chat::with('post', 'room');
      if ($request->messages) // Get Rom's Chat Messages
        return Room::find($id); // TagShow: RoomModule - MessageModule
      elseif ($request->mutate==='my_chats') return // Get Auth Chat Rooms
        $chats->where('user_id', $request->user_id)->get();
      elseif ($request->mutate==='contact_us') return // Contact Us
        $chats->where('user_id', $request->user_id)->get();
      elseif ($request->mutate==='feedback') return // Get Users Feedback
        $chats->where('user_id', $request->user_id)->get();
      elseif ($request->mutate==='users_chats') return // Get Users Chats Rooms
        $chats->where('user_id', '<>', 1)->get();
      elseif ($request->mutate==='trashed_chats') return
        Chat::onlyTrashed()->with('post', 'room')->get(); // toBeDeleted
      elseif ($request->mutate==='all_chats') return $chats->get();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $chat = Chat::find($id);
        Room::destroy($room_id = $chat->room_id);
        Chat::where('room_id', $room_id)->delete();
        DB::table('notifications')->where('notifiable_id', $chat->user_id)->delete();
        $message = Message::where('room_id', $chat->room_id);
        $message->update(['message' => null]);
        $message->delete();
    }
}
