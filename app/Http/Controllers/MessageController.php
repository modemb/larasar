<?php

namespace App\Http\Controllers;

use App\Notifications\MessageNotification;
use Illuminate\Http\Request;
use App\Events\MessageSent;
use App\Models\Message;
use App\Models\Chat;
use App\Models\Room;
use App\Models\User;
use Auth;

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
      $auth = $request->user(); // Auth::user(); // $auth = auth()->user();
      // $auth = $request->user; // Add Message

      $message = [
        'message' => $request->input('message'),
        'room_id' => $request->room_id,
        'user_id' => $auth['id'],
        // 'post_id' => $request->post_id
      ];$messageTrashed = Message::onlyTrashed()->first();

      if ($messageTrashed) {
        $messageTrashed->restore();
        $messageTrashed->update($message);
        $chat = $messageTrashed; // User Message
      } else $chat = Message::create($message);
      // $auth = collect($auth)->forget('posts');

      event(new MessageSent($auth->id, $chat->room_id, $chat->message));
      // broadcast(new MessageSent($auth['id'], $chat->room_id, $chat->message))->toOthers();

      foreach (Chat::where('room_id', $chat->room_id)->get() as $chat)
      if ($chat->user_id != $auth->id) // Send Notifications To ChatRoom's Users
      User::find($chat->user_id)->notify(new MessageNotification);

      return [
        'status' => 'Message Sent! room'.$chat->room_id.' message'.$chat->id,
        'auth' => $request->user(),
        '$authId' => $auth->id,
        'message' => $chat->message
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
      if ($request->messages) // Get Rom's Chat Messages
      // return Room::with('messages')->get(); // TagShow: MessageModule
      return Room::find($id); // TagShow: RoomModule - MessageModule
      elseif ($request->rooms) { // Get User Chat Rooms
        // return Room::Get();
        // return Room::with('messages')->where('user_id', $request->user_id)->get();
        return Chat::with('post', 'room')->where('user_id', $request->user_id)->get();
      }
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
        Room::destroy($chat->room_id);
        Message::where('room_id', $chat->room_id)->delete();
        $chat->delete();
    }
}
