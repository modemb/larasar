<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Auth;
use App\User;
use Socialite;
use App\OAuthProvider;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
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
        $this->middleware('guest');
        config([
          'services.github.redirect' => route('oauth.callback', 'github'),
        ]);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }

    /**
     * Redirect the user to the Provider authentication page.
     *
     * @return Response
     */
    public function redirectToProvider($provider)
    {
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
        if($request->input('error') !== null)
            return $request->input('error');

        $user = Socialite::driver($provider)
          ->stateless()
          ->user();

        $email = ($user->email != '')?$user->email:'';
        $name = ($user->name != '')?$user->name:'';
        $avatar = ($user->avatar != '')?$user->avatar:'';

        $localUser = User::where('email', $user->email)->first();


        //$this->validator();

        //If does not exist, create it
        if(!$localUser){
          $localUser = $this->create([
            'email' => $email,
            'name' => $name,
            'password' => 'klksdjanfljkadsf'
          ]);
          OAuthProvider::create([
            'user_id' => $localUser->id,
            'provider' => $provider,
            'provider_user_id' => $user->id,
            'access_token' => $user->token,
            'refresh_token' => $user->refreshToken,
          ]);
          //Login the user
          // Auth::login($localUser);
          //Update Avatar
          User::where('email',$email)
            ->update([
              'avatar' => $avatar
            ]);
          // return 'create';// redirect('/first');
        }

        //Update Avatar
        User::where('email',$email)
          ->update([
            'avatar' => $avatar
          ]);

        //Login the user
        // Auth::login($localUser);

        return [$user];// redirect('/');

    }
}
