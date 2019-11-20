<?php

namespace App\Http\Controllers\Auth;

use Socialite;
use App\Http\Controllers\Controller;
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
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
        config([
            'services.github.redirect' => route('oauth.callback', 'github'),
        ]);
    }

    /**
     * Redirect the user to the GitHub authentication page.
     *
     * @return \Illuminate\Http\Response
     */
    public function redirectToProvider($driver)
    {
      Socialite::driver($driver)->stateless()->redirect()->getTargetUrl();
      return [
          'url' => Socialite::driver($driver)->stateless()->redirect()->getTargetUrl(),
      ];  Socialite::driver($driver)->redirect();
    }

    /**
     * Obtain the user information from GitHub.
     *
     * @return \Illuminate\Http\Response
     */
    public function handleProviderCallback($driver)
    {
        $user = Socialite::driver($driver)
          ->stateless()
          ->user();

        // return [$user];

        // OAuth Two Providers
        $token = $user->token;
        $refreshToken = $user->refreshToken; // not always provided
        $expiresIn = $user->expiresIn;
        $userFromToken = Socialite::driver($driver)->userFromToken($token);

        $http = new \GuzzleHttp\Client; $passport = config('services.passport');

        $response = $http->post($passport['login_endpoint'], [
            'form_params' => [
                'grant_type' => 'password',
                'client_id' => $passport['client_id'],
                'client_secret' => $passport['client_secret'],
                'username' => $user->email,
                'password' => '88888888',
                'scope' => '',
            ]
        ]); return json_decode((string) $response->getBody(), true);
        // OAuth One Providers
        // $tokenSecret = $user->tokenSecret;
        // userFromTokenAndSecret = Socialite::driver($driver)->userFromTokenAndSecret($token, $secret);
        {
          // "token": "cdc5e747a4efa9f3fe8fc2f7981879246abf4ef5",
          // "refreshToken": null,
          // "expiresIn": null,
          // "id": 10342198,
          // "nickname": "modemb",
          // "name": "Mohamed Dembele",
          // "email": "modembfr@gmail.com",
          // "avatar": "https://avatars0.githubusercontent.com/u/10342198?v=4",
          // "user": {
          // "login": "modemb",
          // "id": 10342198,
          // "node_id": "MDQ6VXNlcjEwMzQyMTk4",
          // "avatar_url": "https://avatars0.githubusercontent.com/u/10342198?v=4",
          // "gravatar_id": "",
          // "url": "https://api.github.com/users/modemb",
          // "html_url": "https://github.com/modemb",
          // "followers_url": "https://api.github.com/users/modemb/followers",
          // "following_url": "https://api.github.com/users/modemb/following{/other_user}",
          // "gists_url": "https://api.github.com/users/modemb/gists{/gist_id}",
          // "starred_url": "https://api.github.com/users/modemb/starred{/owner}{/repo}",
          // "subscriptions_url": "https://api.github.com/users/modemb/subscriptions",
          // "organizations_url": "https://api.github.com/users/modemb/orgs",
          // "repos_url": "https://api.github.com/users/modemb/repos",
          // "events_url": "https://api.github.com/users/modemb/events{/privacy}",
          // "received_events_url": "https://api.github.com/users/modemb/received_events",
          // "type": "User",
          // "site_admin": false,
          // "name": "Mohamed Dembele",
          // "company": "MoDemb",
          // "blog": "http://modemb.com/",
          // "location": "Montreal, QC",
          // "email": "modembfr@gmail.com",
          // "hireable": true,
          // "bio": null,
          // "public_repos": 6,
          // "public_gists": 0,
          // "followers": 1,
          // "following": 5,
          // "created_at": "2014-12-29T18:36:48Z",
          // "updated_at": "2019-11-17T15:41:13Z"
        }
    }
}
