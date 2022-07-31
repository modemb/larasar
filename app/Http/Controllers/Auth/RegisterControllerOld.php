<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Models\Team;
use App\Models\User;
use App\Models\Analytic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

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
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

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
     * The user has been registered.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    protected function registered(Request $request, User $user)
    {
        // Analytic::create(['user_id' => $user->id]); // User Analytic

        $user = User::find(1);if($user['role'] != 'Super Admin')
        $user->update(['role' => 'Super Admin']); // Super Admin Role

        return response()->json('Registered Successfully');

        // ======================SANCTUM========================= \\

        // if ($user instanceof MustVerifyEmail) {
        //     return response()->json(['status' => trans('verification.sent')]);
        // }

        // return response()->json($user);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        $emailExist = User::onlyTrashed()->whereNotNull('deleted')
          ->where('email', $data['email'])
          ->first();
        $this->userDeleted = $emailExist?$emailExist:
          User::onlyTrashed()->whereNotNull('deleted')->first();

        // try {
        //   $true = $this->userDeleted['email'] == $data['email'];
        // } catch (\Throwable $th) {
        //   $true = false;
        // }

        return Validator::make($data, [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => $emailExist?'':['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $input)
    {
        $user_name = strtolower($input['first_name'].$input['last_name']); do {
          $user = User::where('name', $user_name)->first();
          if ($user) {
            $id = DB::table('users')->count();
            $id = rand(1, $id);
            $user_name = $user_name.$id;
          } $user_name;
        } while ($user); $this->userData = [
          'status' => 'Registration',
          'name' => $user_name,
          // 'name' => $this->userName($input),
          'first_name' => $input['first_name'],
          'last_name' => $input['last_name'],
          'email' => $input['email'],
          'password' => Hash::make($input['password']),

          'gain' => 500,

          'deleted' => null,
          'email_verified_at' => null,
          'role' => 'User',
        ];

        if ($this->userDeleted) {
          $this->userDeleted->restore();
          // $input['password'] = Hash::make($input['password']);
          // $this->userDeleted['deleted'] = null;
          // $this->userDeleted['email_verified_at'] = null;
          // $this->userDeleted['name'] = $user_name; //$this->userName($input);
          // $this->userDeleted['status'] = 'Registration';
          // $this->userDeleted['role'] = 'User';
          // $this->userDeleted->update($input);
          $this->userDeleted->update($this->userData);
          $teamTrashed = Team::onlyTrashed()->first();
          if ($teamTrashed) {
            $teamTrashed->restore();
            $teamTrashed->update(['user_id' => $this->userDeleted->id]);
          } else $this->createTeam($this->userDeleted); return $this->userDeleted;
        } // TagStore: UserModule

        return DB::transaction(function () use ($input) {
            return tap(User::create($this->userData), function (User $user) {
                $this->createTeam($user);
            });
        });
    }

    /**
     * Create UserName.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    protected function userName($input)
    {   //return 'name';

      $user_name = strtolower($input['first_name'].$input['last_name']); do {
        $user = User::where('name', $user_name)->first(); //false
        if ($user) {
          $id = DB::table('users')->count();
          $id = rand(1, $id);
          $user_name = $user_name.$id;
        } else return $user_name;
      } while ($user);

    }// NotInuse

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
