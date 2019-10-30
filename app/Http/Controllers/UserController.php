<?php

namespace App\Http\Controllers;

// use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use App\User;
use Hash;

class UserController extends Controller
{
    // use AuthenticatesUsers;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    // public function __construct()
    // {
    //     $this->middleware('guest')->except('logout');
    // }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $this->guard()->logout();
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
    { //return env('PASSPORT_LOGIN_ENDPOINT');
      $http = new \GuzzleHttp\Client;

      // $response = $http->post(config('services.passport.login_endpoint'), [
      //     'form_params' => [
      //         'grant_type' => 'password',
      //         'client_id' => config('services.passport.client_id'),
      //         'client_secret' => config('services.passport.client_secret'),
      //         'username' => $request->username,
      //         'password' => $request->password,
      //         'scope' => '',
      //     ]
      // ]); return json_decode((string) $response->getBody(), true);

      if($request->name){
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed'
        ]);

        return User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
      }// Register

      $response = $http->post(env('PASSPORT_LOGIN_ENDPOINT'), [
          'form_params' => [
              'grant_type' => 'password',
              'client_id' => env('PASSWORD_CLIENT_ID'),
              'client_secret' => env('PASSWORD_CLIENT_SECRET'),
              'username' => $request->username,
              'password' => $request->password,
              'scope' => '',
          ]// Login
      ]); return json_decode((string) $response->getBody(), true);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      //
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
        //
    }
}
