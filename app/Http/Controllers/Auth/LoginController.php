<?php

namespace App\Http\Controllers\Auth;

use Auth;
use Hash;
use App\User;
use Socialite;
use App\OAuthProvider;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Exceptions\EmailTakenException;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function driver($provider)
    {
        config([
          'services.'.$provider.'.redirect' => route('oauth.callback', $provider),
        ]);
    }

    /**
     * Redirect the user to the Provider authentication page.
     *
     * @return Response
     */
    public function redirectToProvider($provider)
    {
        $this->driver($provider);
        return [
          'url' => Socialite::driver($provider)
            ->stateless()
            ->redirect()
            ->getTargetUrl()
        ];
    }

    /**
     * Obtain the user information from GitHub.
     *
     * @return Response
     */
    public function handleProviderCallback(Request $request, $provider)
    {
        if($request->input('error') !== null) return $request->input('error');

        $this->driver($provider);

        $user = Socialite::driver($provider)
          ->stateless()
          ->user();

        $email = ($user->email)?$user->email:'';
        $name = ($user->name)?$user->name:'';
        $avatar = ($user->avatar)?$user->avatar:'';

        $localUser = User::where('email', $user->email)->first();

        //$this->validator();

        //If does not exist, create it
        if(!$localUser){
          $localUser = User::create([
            'email' => $email,
            'name' => $name,
            'password' => Hash::make('88888888')
          ]);
          // return 'create';// redirect('/first');
        }

        //Update Avatar
        User::where('email',$email)
          ->update([
              'avatar' => $avatar,
              'password' => Hash::make('88888888')
          ]);

        //Login the user
        // Auth::login($localUser);

        $guzzle = new \GuzzleHttp\Client;$passport = config('services.passport');

        $response = $guzzle->post($passport['login_endpoint'], [
            'form_params' => [
              'grant_type' => 'password',
              'client_id' => $passport['client_id'],
              'client_secret' => $passport['client_secret'],
              'username' => $user->email,
              'password' => '88888888',
              'scope' => '',
            ],
        ]); $res = json_decode((string) $response->getBody(), true);

        return  view('oauth/callback', [
            'token' => $res['access_token'],
            'token_type' => $res['token_type'],
            'expires_in' => $res['expires_in'],
            'transfer' => 'http://larasar.modemb.com'
        ]);
    }
}
