<?php

namespace App\Http\Controllers\Auth;

use DB;
use Log;
use Auth;
use Hash;
use Socialite;
use App\Models\User;
use App\Models\Team;
use App\Models\Analytic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;

// use Illuminate\Foundation\Auth\AuthenticatesUsers;


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

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/';
    // public $param;

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
     * Redirect the user to the Provider authentication page.
     *
     * @return Response
     */
    public function redirect($provider)
    {
        $this->driver($provider); return [
          'url' => Socialite::driver($provider)->stateless()->redirect()->getTargetUrl()
        ];
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
     * Obtain the user information from Provider.
     *
     * @return Response
     */
    public function callback(Request $request, $provider)
    {   // return $request;

        if($request->input('error') !== null) return 'error'; do {
          unset($_COOKIE['laravel_token']);
          setcookie('laravel_token', null, -1, '/');
        } while (isset($_COOKIE['laravel_token']));

        $seed = str_split('abcdefghijklmnopqrstuvwxyz'
            .'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            .'0123456789!@#$%^&*()'); // and any other characters
        shuffle($seed); // probably optional since array_is randomized; this may be redundant
        $rand = ''; foreach (array_rand($seed, 8) as $k) $rand .= $seed[$k]; $password = $rand;

        // $provider;
        $localUser = User::where('email', $provider)->first();

        $user_agent = $_SERVER['HTTP_USER_AGENT'];

        if (preg_match('/\b(modembAndroid|modembIos)\b/i', $user_agent, $matches)) {
            // Match found, and $matches[0] contains the matched string
            $matchedString = $matches[0];

            if (stripos($matchedString, 'modembAndroid') !== false) {
                $app = 'Android'; // Android detected
            } elseif (stripos($matchedString, 'modembIos') !== false)
                $app = 'iOS'; // iOS detected
        } else $app = ''; // No match found

        if (!$localUser) {
          $this->driver($provider); $password = '88888888';
          $user = Socialite::driver($provider)->stateless()->user();

          // All providers...
          // $user->getId();
          // $user->getNickname();

          $email = $user->email??$user->getEmail();
          $avatar = $user->avatar??$user->getAvatar();
          $name = $user->name??$user->getName();
          $full_name = explode(' ', $name);
          $first_name = isset($full_name[0])?$full_name[0]:'';
          $last_name = isset($full_name[1])?$full_name[1]:'';

          $localUser = User::where('email', $email)->first();
          // try {
          //   $localAvatar = stristr($localUser['avatar'], 'images/profile');
          // } catch (\Throwable $th) {
          //   $localAvatar = false;
          // } // Validate User Avatar

          $username = strstr($email, '@', true);
          $user_name = strtolower($username); do {
            $user = User::where('name', $user_name)->first();
            if ($user) { // Social Login Assign UserName
              $id = DB::table('users')->count();
              $id = rand(1, $id);
              $user_name = $user_name.$id;
            } $user_name;
          } while ($user);

          if (!$localUser) $localUser = $this->createUser([
            'gain' => env('GAIN'),
            'currency_code' => env('CURRENCY_CODE'),
            'position' => 'firsTime',
            'role' => 'User',
            'first_name' => $first_name,
            'last_name' => $last_name,
            'name' => $user_name,
            'email' => $email,
            'password' => Hash::make($password)
          ]);// If does not exist, create it
        } try { // Validate User Avatar
          $localAvatar = stristr($localUser['avatar'], 'images/profile');
        } catch (\Throwable $th) {
          $localAvatar = false;
        } $localUser->update([ // Update Avatar
            'email_verified_at' => now(),
            'locale' => $request->cookie('locale'), // TODO  NotWorking
            'status' => isset($avatar)?$provider.$app:null,
            'avatar' => $localAvatar?$localUser->avatar:$avatar
        ]);

        if (config('sanctumApi')) { // env('SANCTUM_API') - config('sanctumApi')
          $token = [ // https://laravel.com/docs/10.x/responses#other-response-types
            'access_token' => $provider,
            'remember' => true,
            'expires_in' => 365
          ]; Auth::login($localUser, $remember = true); // return $token;
          return isset($email) ? response()->view('oauth.callback', ['token' => $token]) :
          /* Social - Email Verify */ response()->view('index', ['token' => $token]);
        } // Login the user https://laravel.com/docs/9.x/authentication#other-authentication-methods

        $user = DB::table('users')->where('email', $email)->first();
        if ($user) $localUser->update(['password' => Hash::make($password)]);
        $originalPass = $user->password;
        $request['originalPass'] = $originalPass;
        $request['email'] = $email;
        $request['password'] = $password;
        $request['remember'] = true;
        // $request['socialite'] = 1;

        return $this->loginApi($request);
    }

    /**
     * Handle an incoming authentication request.
     *
     * @param  \App\Http\Requests\Auth\LoginRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function loginApi(LoginRequest $request)
    {  //return $request;

      $passport = config('services.passport');
      // try {

        $client = [
            'grant_type' => $request->password?'password':'authorization_code',
            'client_id' => $passport['client_id'],
            'client_secret' => $passport['client_secret']
        ];  $data = $request['socialite']?[
            'redirect_uri' => $request->url,
            'code' => $request->code
        ]:[ // https://laravel.com/docs/9.x/socialite#routing
            'username' => $request->email,
            'password' => $request->password,
            'scope' => '*'
        ] + $client; $response = Http::asForm()->post($passport['login_endpoint'], $data);

        // Log::alert($passport);
        // Log::alert($data);
        // Log::alert($response->json());

        $user = User::where('email', $request['email'])->first();
        // if ($user) Analytic::where('user_id', $user['id'])->update(['session' => 'Login']); // ToImproveLogOutWithSession

        if ($request['originalPass']) {
          $user->update(['password' => $request['originalPass']]);
          // view('oauth.callback', ['token' => $response->json()]);
        }// if ($response?->json()['token_type'])
        return $response->json();
        // return $data;

      // } catch (\Throwable $th) {}

    }

    /**
     * The user has been authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  mixed  $user
     * @return mixed
     */
    protected function authenticated(Request $request, $user)
    {
        //
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function createUser($data)
    {
        $userDeleted = User::onlyTrashed()->where('email', $data['email'])->first();
        if (!$userDeleted) $userDeleted = User::onlyTrashed()->whereNotNull('deleted')->first();
        if ($userDeleted) {
          $userDeleted->restore();
          $userDeleted['deleted'] = null;
          $userDeleted->update($data);
          $teamTrashed = Team::onlyTrashed()->first();
          if ($teamTrashed) {
            $teamTrashed->restore();
            $teamTrashed->update(['user_id' => $userDeleted->id]);
          } else $this->createTeam($userDeleted); return $userDeleted;
        } // TagStore: UserModule

        return DB::transaction(function () use ($request) {
            return tap(User::create($data), function (User $user) {
                $this->createTeam($user);
            });
        });
    }

    /**
     * Create a personal team for the user.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    protected function createTeam(User $user)
    {
        $user->ownedTeams()->save(Team::forceCreate([
            'user_id' => $user->id,
            'name' => $user->first_name."'s Team",
            'personal_team' => true,
        ]));
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
      } Analytic::where('user_id', $request->id)->update(['session' => 'Logout']); // ToImproveLogOutWithSession

      $oauth_access_tokens = DB::table('oauth_access_tokens')
        ->where('user_id', $request->id);

      $oauth_access_tokens->get()->each(function ($token, $key) {
        DB::table('oauth_refresh_tokens')
          ->where('access_token_id', $token->id)
          ->delete();
      }); $oauth_access_tokens->delete();

      return $request;//$this->loggedOut($request) ?: 'logged Out Successfully';
    }
}
