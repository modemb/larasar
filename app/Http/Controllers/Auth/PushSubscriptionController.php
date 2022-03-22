<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Foundation\Validation\ValidatesRequests;
// use App\Http\Controllers\Controller; // Added
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;

class PushSubscriptionController extends Controller
{
    use ValidatesRequests;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        if (config('sanctumApi')) $this->middleware('auth:sanctum');
        else $this->middleware('auth:api'); // env('SANCTUM_API') - config('sanctumApi')
    }

    /**
     * Update user's subscription.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        $this->validate($request, ['endpoint' => 'required']);

        $request->user()->updatePushSubscription(
            $request->endpoint,
            $request->publicKey,
            $request->authToken,
            $request->contentEncoding
        );

        return response()->json(null, 204);
    }

    /**
     * Delete the specified subscription.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request)
    {
        $this->validate($request, ['endpoint' => 'required']);

        $request->user()->deletePushSubscription($request->endpoint);

        return response()->json(null, 204);
    }
}
