<?php

namespace App\Http\Controllers\Auth;

use Auth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Broadcast;

class BroadcastController extends Controller
{

    /**
     * Authenticate the request for channel access.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function authenticate(Request $request)
    {   //return auth()->user();
        $string = $request->channel_name; // Authenticate Passport
        $user = User::find(preg_replace('/[^0-9]/', '', $string));
        if ($request->hasSession()) $request->session()->reflash();
        Auth::login($user, $remember = true);

        return Broadcast::auth($request);
        // broadcast(new UserRegistered($user));
    }
}
