<?php

namespace App\Http\Controllers\Auth;

use Log;
use App\Models\Team;
use App\Models\User;
use App\Models\Analytic;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;

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

    // use RegistersUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    // protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Handle an incoming registration request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function register(Request $request)
    {
        $emailExist = User::onlyTrashed()->whereNotNull('deleted')
          ->where('email', $request['email'])
          ->first();
        $this->userDeleted = $emailExist?$emailExist:
          User::onlyTrashed()->whereNotNull('deleted')->first();

        $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => $emailExist?'':['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = $this->create($request);

        Log::emergency('$user '.$user);

        if($user->id==1&$user['role'] != 'Super Admin')
        $user->update(['role' => 'Super Admin']); // Super Admin Role

        return response()->json('Registered Successfully');
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create($request)
    {
        $user_name = strtolower($request['first_name'].$request['last_name']); do {
          $user = User::where('name', $user_name)->first();
          if ($user) {
            $id = DB::table('users')->count();
            $id = rand(1, $id);
            $user_name = $user_name.$id;
          } $user_name;
        } while ($user); $this->userData = [
          'status' => 'Registration lr',
          'name' => $user_name,
          'first_name' => $request['first_name'],
          'last_name' => $request['last_name'],
          'email' => $request['email'],
          'password' => Hash::make($request['password']),

          'gain' => 500,

          'deleted' => null,
          'email_verified_at' => null,
          'role' => 'User',
        ];

        if ($this->userDeleted) {
          $this->userDeleted->restore();
          $this->userDeleted->update($this->userData);
          $teamTrashed = Team::onlyTrashed()->first();
          if ($teamTrashed) {
            $teamTrashed->restore();
            $teamTrashed->update(['user_id' => $this->userDeleted->id]);
          } else $this->createTeam($this->userDeleted); return $this->userDeleted;
        } // TagStore: UserModule

        return DB::transaction(function () use ($request) {
            return tap(User::create($this->userData), function (User $user) {
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
}
