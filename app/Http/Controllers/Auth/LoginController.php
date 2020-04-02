<?php

namespace App\Http\Controllers\Auth;

use DB;
use Auth;
use Hash;
use App\User;
use Socialite;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
// use App\Exceptions\EmailTakenException;
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
    public $param;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(/*$param*/)
    {
        $this->middleware('guest')->except('logout');
        // $this->param = $param;
    }

    /**
     * Handle a login request to the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function login(Request $request)
    {
        if($request->api) config(['app.locale' => $request->locale]);//Api

        $this->validateLogin($request);

        if($request->api) return $this->authenticated($request);//Api

        // If the class is using the ThrottlesLogins trait, we can automatically throttle
        // the login attempts for this application. We'll key this by the username and
        // the IP address of the client making these requests into this application.
        if (method_exists($this, 'hasTooManyLoginAttempts') &&
            $this->hasTooManyLoginAttempts($request)) {
            $this->fireLockoutEvent($request);

            return $this->sendLockoutResponse($request);
        }

        if ($this->attemptLogin($request)) {
            return $this->sendLoginResponse($request);
        }

        // If the login attempt was unsuccessful we will increment the number of attempts
        // to login and redirect the user back to the login form. Of course, when this
        // user surpasses their maximum number of attempts they will get locked out.
        $this->incrementLoginAttempts($request);

        return $this->sendFailedLoginResponse($request);
    }

    /**
     * The user has been authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  mixed  $user
     * @return mixed
     */
    protected function authenticated(Request $request)
    {
        $guzzle = new \GuzzleHttp\Client;$passport = config('services.passport');

        $response = $guzzle->post($passport['login_endpoint'], [
            'form_params' => [
              'grant_type' => 'password',
              'client_id' => $passport['client_id'],
              'client_secret' => $passport['client_secret'],
              'username' => $request->email,
              'password' => $request->password,
              'scope' => '',
            ],
        ]); $res = json_decode((string) $response->getBody(), true);

        if ($request->api) return $res;
        elseif ($request->_token) return;
        return  view('oauth/callback', [
            'token' => $res['access_token'],
            'token_type' => $res['token_type'],
            'expires_in' => $res['expires_in'],
            'transfer' => 'http://larasar.modemb.com'
        ]);
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

        $this->driver($provider);$password = '88888888';

        $seed = str_split('abcdefghijklmnopqrstuvwxyz'
            .'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            .'0123456789!@#$%^&*()'); // and any other characters
        shuffle($seed); // probably optional since array_is randomized; this may be redundant
        $rand = ''; foreach (array_rand($seed, 8) as $k) $rand .= $seed[$k];//$password = $rand;

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
            'role' => 'Seller',
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password)
          ]);
        }

        $user = User::find(1);if($user['role'] != 'Super Admin')
        $user->update(['role' => 'Super Admin']);//Super Admin Role

        User::where('email',$email)
          ->update([
              'avatar' => $avatar,
              'password' => Hash::make($password)
          ]); //Update Avatar

        //Login the user
        // Auth::login($localUser);

        $request['email'] = $email;
        $request['password'] = $password;
        return$this->authenticated($request);
    }

    /**
     * Log the user out of the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        if ($request->_token) {
          $this->guard()->logout();

          $request->session()->invalidate();

          return $this->loggedOut($request) ?: redirect('/');
        }

        $oauth_access_tokens = DB::table('oauth_access_tokens')
          ->where('user_id', $request->id);

        $oauth_access_tokens->get()->each(function ($token, $key) {
          DB::table('oauth_refresh_tokens')
            ->where('access_token_id', $token->id)
            ->delete();
        });

        $oauth_access_tokens->delete();

        return $this->loggedOut($request) ?: 'logged Out Successfully';
    }
}
