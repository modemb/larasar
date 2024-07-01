<?php

namespace App\Http\Controllers;

// use Illuminate\Foundation\Auth\AuthenticatesUsers;
use App\Http\Controllers\Auth\RegisterController;
use neto737\BitGoSDK\Enum\CurrencyCode;
// use neto737\BitGoSDK\BitGoSDK;
// use App\Events\MessageSent;
use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Str;
use App\Models\Subcategory;
use App\Mail\InfoSuguffie;
use App\Models\Analytic;
use App\Models\Category;
use App\Models\Currency;
use App\Models\Location;
use App\Models\Payment;
use App\Models\Message;
use App\Models\Session;
use App\Models\Report;
use App\Files\Picture;
use App\Models\User;
use App\Models\Room;
use App\Models\Chat;
use App\Models\View;
use App\Models\Team;
use App\Models\Post;
use App\Models\Pic;
// use Carbon\Carbon;
// use Session;
// use Storage;
use Cookie;
// use Image;
use Mail;
use File;
use Hash;
use Auth;
use Log;
use DB;

/**
 * Tags: UserModule - AnalyticModule - BitgoModule - IpDebugModule - FileModule
 *       ReportModule - MessageModule - LocationModule - SessionModule - Invited
 *       TagSendCode - CodeModule
 *
 * @to Profile.vue - Users.vue - Analytics.vue
 */
class UserController extends Controller
{

    // use AuthenticatesUsers;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth:api');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      // ini_set('max_execution_time', 1800);
      // -------- TagIndex: MessageModule Delete All Messages Older Than 1 Month /-1 month \\
      Room::where('updated_at', '<', date('Y-m-d H:i:s', strtotime('-1 month')))->delete();
      Chat::where('updated_at', '<', date('Y-m-d H:i:s', strtotime('-1 month')))->delete();
      // Notification::where('updated_at', '<', date('Y-m-d H:i:s', strtotime('-1 day')))->delete();
      DB::table('notifications')->where('updated_at', '<', date('Y-m-d H:i:s', strtotime('-1 month')))->delete();
      $message = Message::where('updated_at', '<', date('Y-m-d H:i:s', strtotime('-1 month')));
      $message->update(['message' => null]); $message->delete();
      // -------- TagIndex: ViewModule Delete All Views Older Than 1 Years /-1 year \\
      View::where('updated_at', '<', date('Y-m-d H:i:s', strtotime('-1 year')))->delete();
      // -------- TagIndex: UserModule Delete All Trashed Users Older Than 1 Years /-1 year \\
      User::onlyTrashed()->where('updated_at', '<', date('Y-m-d H:i:s', strtotime('-1 year')))->update(['deleted' => 1]);
      Team::onlyTrashed()->where('updated_at', '<', date('Y-m-d H:i:s', strtotime('-1 year')))->update(['deleted' => 1]);
      // -------- TagIndex: UserModule Delete All Users Not Verify For 1 Years /-1 year \\
      $users = User::whereNull('email_verified_at')->where('created_at', '<', date('Y-m-d H:i:s', strtotime('-1 year')));
      $users->update(['deleted' => 1]); $users->delete(); // return app()->currentLocale();
      $teams = Team::whereDoesntHave('user');
      $teams->update(['deleted' => 1]);
      $teams->delete();
      // -------- TagIndex: CodeModule Send Email Verification Code -- \\// if (date('d') == 15)
      foreach (User::whereNull('email_verified_at')->whereNull('code')->get() as $user) $this->sendCode($user);
      // -------- TagIndex: AnalyticModule Delete All Unauthenticated Analytic Older Than 1 Years /-1 year ---\\
      Analytic::whereNull('user_id')->where('updated_at', '<', date('Y-m-d H:i:s', strtotime('-1 year')))->delete();
      // -------- TagIndex: currencyModule Delete Currency Older Than 1 Month /-1 month ---\\
      // Currency::where('created_at', '<', date('Y-m-d H:i:s', strtotime('-1 month')))->delete();
      // ================================================================================ \\
      return 'User Cron Job Done';
    } // https://laravel.com/docs/9.x/logging#writing-log-messages

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function save($request)
    { //return $request->id;

      if ($request->ip) { // Save Analytic

        $analytic = $this->analytic; // TagSave: AnalyticModule
        $hostUser = User::where('name', $request->hostUserName)->first();

        if ($request->id) { // Auth Analytic

          if ($request->newAuth||$request->authCode) {
            $analytic->session = env('NewAuth');
            $analytic->user_id = $request->id; // Store New Auth Id To It's Invited/Guest Analytic

            if ($analytic->host_id || // Affiliate Link - IP Has To Be Different
              $hostUser&&$hostUser->id !== $request->id) // Affiliate Code
              $this->invitedUser = User::find($request->id)->update([
                  'user_id' => $analytic->host_id??$hostUser->id, // Invited User
                  'gain' => env('GAIN')*2 // Assign Invited User To Host user
              ]); // Invited User - AnalyticAssignInvitedUserModule

          } elseif ($analytic->ip !== $request->ip) $analytic->session = env('ReturningAuthNewIP');
            else $analytic->session = env('ReturningAuth');
        } else { // Guest Analytic
          if ($analytic->user_id) $analytic->session = env('RecordedGuest');
          elseif ($hostUser) $analytic->session = env('InvitedGuest'); // TagSave: AnalyticInvitedUserModule
          elseif ($analytic->session) $analytic->session = env('ReturningGuest');
          else $analytic->session = env('NewGuest');
        } if ($hostUser) $analytic->host_id = $hostUser->id; // IP Has To Be Different

        if (!$request->post_id) $this->location($request); // TagSave: UserLocationModule

        if ($request->city) $analytic->city = $request->city;
        if ($request->region) $analytic->region = $request->region;
        if ($request->country) $analytic->country = $request->country_name??$request->country;
        if ($request->currency) $analytic->currency = $request->currency;
        if ($request->currency_name) $analytic->currency_name = $request->currency_name;
        if ($request->app) $analytic->app = $request->app; // App installed

        $analytic->ip = $request->ip;
        $analytic->updated_at = now(); // date('Y-m-d H:i:s');
        $analytic->latitude = $request->latitude??$request->lat;
        $analytic->longitude = $request->longitude??$request->lon;
        $analytic->utc_offset = $request->utc_offset; $analytic->save();

        // ----------------- TagSave: PageViewModule --------------------------- \\
        $view = View::where('slug', $request->slug)->where(function ($query) use ($request) {
            if ($request->id) $query->where('user_id', $request->id);
            else $query->where('ip', $request->ip);
        })->first(); // TagSave: ViewModule

        $viewData = [
          'ip' => $request->ip,
          'user_id' => $request->id,
          'post_id' => $request->post_id,
          'slug' => $request->slug
        ];//Log::warning($viewData);Log::warning($view);
        if ($view) return 'viewed'; else {
          $viewTrashed = View::onlyTrashed()->first();
          $post = Post::find($request->post_id);
          if ($post) $post->update(['count' => $post->count+1]);
          if ($viewTrashed) {
            $viewTrashed->restore();
            $viewTrashed->update($viewData);
          } else View::create($viewData); return 'view';
        } // ----------------- PageViewModule End --------------------------- \\

      } elseif ($request->from) { // Save Currency

        if ($request->apiMessage) return ['e' => $request->apiMessage];

        $from_to = strtoupper($request->from.'_'.$request->to);
        $currency = Currency::where('from_to', $from_to)->first(); // TagSave: CurrencyModule

        $currencyDeleted = Currency::onlyTrashed()->whereNotNull('deleted')->first();

        if (!$currency&&$currencyDeleted) $currencyDeleted->restore();

        $currency = $currency??$currencyDeleted?? new Currency;

        $currency_created_at = strtotime($currency?->created_at);
        $renew_date = strtotime(date('Y-m-d H:i:s', strtotime('-1 month')));

        Log::warning($currency?->created_at.' < '.date('Y-m-d H:i:s', strtotime('-1 month')));
        Log::warning($currency?->created_at<date('Y-m-d H:i:s', strtotime('-1 month')));
        Log::warning($currency_created_at<$renew_date);

        if (!($currency?->rate>0)) $currency->from_to = $from_to;
        if ($currency?->deleted) $currency->deleted = Null;
        if ($currency_created_at<$renew_date) // Update Currency
            $currency->update(['created_at' => now(), 'rate' => 0]);

        if ($request->from) $currency->from = $request->from;
        if ($request->to) $currency->to = $request->to;
        if ($request->from_name) $currency->from_name = $request->from_name;
        if ($request->to_name) $currency->to_name = $request->to_name;
        if ($request->update||$request->rate>0) $currency->rate = $request->rate;
        if ($request->decimal_digits) $currency->decimal_digits = $request->decimal_digits;
        if ($request->amount) $currency->amount = $request->amount;
        if ($request->result) $currency->result = $request->result;

        $currency->save(); if ($request->auth_id&&$currency?->rate>0) {
          $request->update = $request->updateUser;
          $request->rate = $currency?->rate;
          $request->currency_code = $request->to;
          $this->update($request, $request->auth_id);
          return $currency?->rate;
        } return 'abort';
      }
    } // https://laravel.com/docs/11.x/eloquent-relationships#the-save-method

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    { //return $request;

      $user = $request->user(); // Auth::user();

      if ($request->ip) { // Add Guest Analytic

        $analytic = Analytic::where('ip', $request->ip)->first();
        $analyticTrashed = Analytic::onlyTrashed()->first();

        if (!$analytic&&$analyticTrashed) $analyticTrashed->restore();

        $analytic = $analytic?->user_id?$analytic:$analyticTrashed;

        $this->analytic = $analytic ?? new Analytic; // Guest

        $this->save($request); // TagStore: AnalyticModule from axios.js

        if ($this->analytic->session===env('NewGuest')) return response()->json([
            'success' => 'Welcome To The World Classified Marketplace'
        ]); // New Guest Analytic IP

        if ($this->analytic->session===env('_ReturningGuest')) return response()->json([
            'success' => 'SignUp And Start Making Money'
        ]); // Returning Guest Analytic IP

        if ($this->analytic->session===env('_RecordedGuest')) return response()->json([
            'success' => 'Welcome Back Please Login'
        ]); // Recorded Guest Analytic IP

        if ($this->analytic->session===env('InvitedGuest')) return response()->json([
            'message' => 'Please Register To Fulfil Your invitation'
        ]); // Invited User's Analytic

      } elseif ($request->user_room) { // Add Message - NotInUse

        $chat = Chat::where([
          // ['post_id', $request->post_id],
          ['user_id', $request->user_id] // Visiter
        ])->first(); // Validate New User's Room

        $room = $chat?->room??0;

        $roomTrashed = Room::onlyTrashed()->first();
        $roomName = ['name' => $request->post_title];
        // $roomName = ['name' => $post->post_title, 'link' => '/post/'.$post->id];

        if (!$room&&$roomTrashed) {
          $roomTrashed->restore();
          // $roomTrashed->name = null;
          $roomTrashed->update($roomName); // Create New Post Room
          $room = $roomTrashed; // TagStore: MessageModule
        } elseif (!$room) $room = Room::create($roomName);

        $this->AddUserToRoom($request->user_id, $room->id);

        return $room->id; // TagStore: chatModule // =====================================

        // $room = $user->rooms()->where('post_id', $request->post_id)->first();
        $room = Room::where('post_id', $request->post_id)->first();
        $roomTrashed = Room::onlyTrashed()->first();
        $post_id =['post_id' => $request->post_id];

        if (!$room&&$roomTrashed) {
          $roomTrashed->restore();
          $roomTrashed->update($post_id);
          $room = $roomTrashed; // Create Post Room
        } elseif (!$room) $room = Room::create($post_id);

        // =============================================================

        $chatRoom = Chat::where('room_id', $room->id)->first(); $user_id = [
          'user_id' => $user['id'],
          'room_id' => $room->id,
          'post_id' => $request->post_id
        ];$chatTrashed = Chat::onlyTrashed()->first();

        if (!$chatRoom&&$chatTrashed) {
          $chatTrashed->restore();
          $chatTrashed->update($user_id);// Add User To Room
        } elseif (!$chatRoom) Chat::create($user_id);

        // =====================================================================

        $message = [
          'message' => $request->input('message'),
          'room_id' => $room->id,
          'user_id' => $user['id'],
          'post_id' => $request->post_id
        ];$messageTrashed = Message::onlyTrashed()->first();

        if ($messageTrashed) {
          $messageTrashed->restore();
          $messageTrashed->update($message);
          $chat = $messageTrashed; // User Message
        } else $chat = Message::create($message);
        $user = collect($user)->forget('posts');
        // event(new MessageSent($user->id, $chat->message));
        broadcast(new MessageSent($user, $room->id, $chat->message))->toOthers();
        return [
          'status' => 'Message Sent! room'.$chatRoom->room_id.' - '.$chatRoom->id,
          'room_id' => $room->id,
          'message' => $chat->message
        ]; // TagStore: MessageModule
      } elseif ($request->api) { // Add User - NotDone
        return redirect()->action([RegisterController::class, 'register']);
      } elseif ($request->id) { // Restore User
        $userTrashed = User::onlyTrashed()->find($request->id);
        $userTrashed->restore();
        $teamTrashed = Team::onlyTrashed()->first();
        if ($teamTrashed) {
          $teamTrashed->restore(); // Team Restore
          $teamTrashed['user_id'] = $request->id;
          $teamTrashed['name'] = $userTrashed->first_name."'s Team";
          $teamTrashed->update();
        } else $this->createTeam($userTrashed);
      } elseif ($request->log) { // Log User
        // Cookie::queue(Cookie::make('token', 'value', 120));
        $user = User::find($request->userId);
        return Auth::login($user, $remember = true);
      } elseif ($request->restorePics) { // Restore Pic
        foreach ($request->restorePics as $pic)
          Pic::onlyTrashed()->whereNull('deleted')
            ->where('pic', $pic) // TagStore: FileModule
            ->restore(); // TagStore: restoreFilePostModule
      } elseif ($request->filesRestore) { // Restore All Pic
        Pic::onlyTrashed()->whereNull('deleted')->restore();
      } elseif ($request->location_id) { // Restore Location
        $locationTrashed = Location::onlyTrashed()
          ->find($request->location_id);
        return $locationTrashed->restore();
      } elseif ($request->currency_id) { // Restore Currency
        $currencyTrashed = Currency::onlyTrashed()
          ->find($request->currency_id);
        return $currencyTrashed->restore();
      } elseif ($request->fromAnalytics) { // From Analytics
        foreach(DB::table('analytics')->get() as $request)
         $this->location($request); // TagStore: LocationModule
      } elseif ($request->code) { // User Email Verification Code

        $error = \Illuminate\Validation\ValidationException::withMessages([
            'code' => [__('Code Does Not Match')]
        ]); $hashedCode = $user->code;

        if (Hash::check($request->code, $hashedCode)) {
          $user->fill([
            'email_verified_at' => now(),
            'code' => Null ])->save();
          return 'code match...';
        } throw $error; // TagStore: CodeModule

      } elseif ($request->token) return $this->sendCode($user);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    { // return is_numeric($request->filterUsers);
      // Session::get('a');
      // return session('a');
      // return session('a', 'default');
      // return (int) ( (0.1+0.7) * 10 ); // echoes 7!
      // Log::warning($request->session()->regenerate());
      // return date('Y-m-d H:i:s', strtotime('today'));

      $pics = Pic::whereNull('deleted')->orderBy('pic', 'desc');  // Pic::all()
      $picsAchieved = Pic::onlyTrashed()->whereNull('deleted')->orderBy('pic', 'desc'); // Show Admins' Achieved Users
      $user = User::find($id);

      if ($request->mutate === 'my_pics') return // TagShow: LibraryModule;
        $pics->where('user_id', $id)->get(); // Show Auth's Pics
      if ($request->mutate === 'trashed_pics') return // TagShow: FileModule
        $picsAchieved->where('user_id', $id)->get(); // Show Auth's Achieved Pics
      if ($request->mutate === 'users_pics') return // TagShow: Users Pics
        $pics->where('user_id', '<>', 1)->get();
      if ($request->mutate === 'avatars') return // TagShow: AvatarsModule
        DB::table('users')->whereNotNull('avatar')->get(['id', 'avatar']);
      if ($request->mutate === 'all_pics') return  // $pics->get(); // TagShow: Users Pics
        DB::table('pics')->whereNull('deleted')->orderBy('pic', 'desc')->get();
      if ($request->mutate === 'all_trashed_pics') return $picsAchieved->get(); // All Trashed Pics

      // if ($request->location||($request?->mutate === 'placeGetter')) return $this->location($request); // TagShow: LocationModule
      if ($request->location||$request->search) return $this->location($request); // TagShow: LocationModule
      if ($id==='place') return Location::select('locations.*', DB::raw('6371
        * acos(cos(radians('.$request->lat.')) * cos(radians(latitude))
        * cos(radians(longitude) - radians('.$request->lng.'))
        + sin(radians('.$request->lat.')) * sin(radians(latitude))) AS distance'))
        ->orderBy('distance')->having('distance', '<=', 100) // Nearest Location Longitude And Latitude
        ->first(); // TagShow: geolocationLocationModule - https://laracasts.com/discuss/channels/laravel/laravel-nearest-location-longitude-and-latitude

      if ($request->getUser) return $user; // Get Chat User
      elseif ($id==='analytics') { // Users analyticsGetter

        // return DB::table('analytics')->get();
        // return Analytic::all();

        // $analytics = DB::table('analytics')->leftJoin('users', 'users.id', 'analytics.user_id');
        $analytics = Analytic::leftJoin('users', 'users.id', 'analytics.user_id');

        // $analytics = $request->expandingRow?Analytic::leftJoin('users', 'users.id', 'analytics.user_id'):
        //                       DB::table('analytics')->leftJoin('users', 'users.id', 'analytics.user_id');

        $analytics->whereNull('analytics.deleted_at')->select('users.*','analytics.*'); // return '$request';

        if ($request->proxyDate) $analytics->where('analytics.updated_at', $request->proxyDate)
          ->orWhereBetween('analytics.updated_at', [$request->from, $request->to]);
        if ($request->period) $analytics->whereBetween('analytics.updated_at', [date('Y-m-d H:i:s', strtotime($request->period)), now()]);

        if ($request->filterAnalytics) $analytics->where(function ($query) use ($request) {
          $query->where('email', 'like', "%$request->filterAnalytics%")
              ->orWhere('name', 'like', "%$request->filterAnalytics%");
        }); // Filer Users in Analytic

        return $analytics->paginate(); // TagShow: AnalyticModule from Analytics.vue
      } elseif ($id==='views') { // Get Posts views

        $views = View::join('analytics', function ($join) {
            $join->on('analytics.user_id', 'views.user_id')
              ->orOn('analytics.ip', 'views.ip')
              ->whereNull('analytics.user_id');
        });//->distinct();

        if ($request->proxyDate) $views->whereDate('views.updated_at', $request->proxyDate)
          ->orWhereBetween('views.updated_at', [$request->from, $request->to]);
        if ($request->period) $views->whereBetween('views.updated_at', [date('Y-m-d H:i:s', strtotime($request->period)), now()]);

        if ($request->filterViews) $views->whereHas('user', function ($query) use ($request) {
          $query->where('name', 'like', "%$request->filterViews%")
              ->orWhere('email', 'like', "%$request->filterViews%");
        }); // $request->perPage

        // return $views->get(); // TagShow: ViewModule
        return $views->paginate(); // TagShow: ViewModule
      } elseif ($id==='reports') { // Get Users reports

        // $reports = DB::table('reports')->whereNotNull('start_date');
        $reports = Report::whereNotNull('end_date'); // Reports

        if ($request->post_id) $reports = Report::where('post_id', $request->post_id)
                        ->whereNull('end_date'); // Post Pending Payments
        if ($request->pending) $reports = Report::whereNull('end_date'); // Posts Pending Payments
        if ($request->role === 'User') $reports->where('user_id', $request->id); // User Reports
        if ($request->users_reports) $reports->leftJoin('users', 'users.id', 'reports.user_id') // Users' Reports
                                             ->where('reports.user_id', $request->id) // Auth's Users
                                             ->select('reports.*'); // Auth's Users Reports
        if ($request->proxyDate) $reports->whereDate('updated_at', $request->proxyDate)
          ->orWhereBetween('updated_at', [$request->from, $request->to]);
        if ($request->period) $reports->whereBetween('updated_at', [date('Y-m-d H:i:s', strtotime($request->period)), now()]);
        return $reports->get(); // TagShow: ReportModule
      } if ($request->avatar) $request->avatar->new['avatar']; // Show User Avatar

      // elseif ($id==='currency') return $this->currency($request); // TagShow: CurrencyModule
      // elseif ($id==='cart') return Payment::whereNotNull('token')->get(); // Get Pending Payments

      if ($request->mutate === 'my_users') $usersList =
        User::where('user_id', $id);  // Show User's Users
      elseif ($request->mutate === 'userTrashed') $usersList =
        User::onlyTrashed()->whereNull('deleted'); // Show Admins' Trashed Users
      elseif ($request->mutate === 'userDeleted') $usersList =
        User::onlyTrashed()->whereNotNull('deleted'); // Show Admins' Deleted Users
      elseif ($request->mutate === 'users') $usersList =
        User::whereNull(['deleted_at', 'deleted']); // Show Admins' Users

      if (isset($usersList)) return $usersList->where(function ($query) use ($request) {
        if (is_numeric($request->filterUsers)) return $query->where('id', $request->filterUsers);
        if ($request->filterUsers) $query->where('email', 'like', "%$request->filterUsers%")
        /* Filter Users And Load It */ ->orWhere('name', 'like', "%$request->filterUsers%");
      })->paginate();// TagShow: UserModule - Get Users List Filtered

      if ($request->locationsData === 'locations') return Location::get(); // Show Locations
      elseif ($request->locationsData === 'locDuplicated') return Location::whereIn('place', function ( $query ) {
          $query->select('place')->from('locations')->groupBy('place')->havingRaw('count(*) > 1');
      })->get(); // Show Duplicated Locations
      elseif ($request->locationsData === 'locTrashed') return Location::onlyTrashed()->whereNull('deleted')->get(); // Show Trashed Locations
      elseif ($request->currenciesData === 'currencies') return Currency::all(); // Show Currencies
      elseif ($request->currenciesData === 'cyDuplicated') return Currency::whereIn('to', function ( $query ) {
          $query->select('to')->from('currencies')->groupBy('to')->havingRaw('count(*) > 1');
      })->get(); // Show Duplicated Currency
      elseif ($request->currenciesData === 'cyTrashed') return Currency::onlyTrashed()->whereNull('deleted')->get(); // Show Trashed Currencies
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    { // return$request->avatar;
      // return User::where('first_name', 'Mohamed')->toRawSql();

      if ($request->ip) { // Update Auth And Guest Analytic

        $this->analytic = Analytic::where('user_id', $request->id)->first(); // Auth
        $request->newAuth = !$this->analytic; // Store New Auth Id To It's Guest Analytic

        if ($this->analytic) $view = $this->save($request); // If Auth Analytic Exist
        else $view = $this->store($request); // TagUpdate: AnalyticModule from axios.js

        $guest_analytic_ip = Analytic::where('ip', $this->analytic->ip)->whereNull('user_id')
          ->first(); // Check If Auth Guest Old IP Exists

        if ($guest_analytic_ip) // Replace Old To The New IP
          $guest_analytic_ip->delete(); // And Delete It's Invited/Guest IP

        if ($this->analytic->session===env('NewAuth')) return response()->json([
            'message' => isset($this->invitedUser)?'You Won 500 SUD':'Almost there !!!'
        ]); // New Auth's Analytic

        return [
          'ip' => $request->ip(),
          'view' => $view
        ];
      } elseif ($request->update) { // Update Users

        $user = User::find($request->id??$id);
        $check = Auth::validate([
            'email'    => $user->email,
            'password' => $request->password
        ]); $file = $request->file('avatar');
        if ($user->deleted) $user->deleted = Null;
        if ($request->email && $request->admin) $user->email = $request->email;
        if ($request->name) {
          $this->validate($request, [
              'name' => 'required|string|max:255|unique:users'
          ]); $user->name = $request->name;
        } // TagUpdate: UserNameModule
        if ($request->first_name) $user->first_name = $request->first_name;
        if ($request->last_name) $user->last_name = $request->last_name;
        if ($request->phone) $user->phone = $request->phone;
        if ($request->address) $user->address = $request->address;
        if ($request->city) $user->city = $request->city;
        if ($request->region) $user->region = $request->region;
        if ($request->postal_code) $user->postal_code = $request->postal_code;
        if ($request->currency_code) $user->currency_code = $request->currency_code;
        if ($request->country_code) $user->country_code = $request->country_code;
        if ($request->country) $user->country = $request->country;
        if ($request->role) $user->role = $request->role;
        if ($request->locale) $user->locale = $request->locale;
        // if (strlen($request->locale)>0) $user->locale = $request->locale;
        if ($table = $request->table) $table = DB::table($request->table)->whereNotNull('deleted')
          ->whereNull('deleted_at')->update([
          'deleted_at' => now()  // Fix Table
        ]); if ($table) return ['success' => 'Table Fixed'];
        if ($request->credit<=$user->credit) {
          $user->gain += $request->credit;
          $user->credit -= $request->credit;
        } // Assigned Money From Credit To Gain
        if ($request->gain>0) $user->gain = $request->gain;
        if ($request->rate>0) $user->rate = $request->rate;
        if ($request->pwd || $request->update_password || $request->update_email) {
          if ($request->update_password) $request->new_password = $check = $request->update_password; // Admin Update Password
          if ($request->email && $request->update_email) $user->email = $request->email;
          if (!$check) return ['success' => 'Current Password Do Not Match Our Record'];
          if ($request->delete_account) return $this->destroy($request, $id);
          if (!$request->new_password || $request->new_password != $request->password_confirmation)
          if (!$request->update_email) return ['success' => 'Password Confirmation Do Not Match'];
          if (!$request->update_email) $user->password = bcrypt($request->new_password);
        } // Update Password or Email
        if ($request->hasFile('avatar')) {
          $path = $id.'.png'; // $file->getClientOriginalName();
          $path = $file->storeAs('files/', $path);
          $file->move('files/', $path);
          $user->avatar = $path;
        } // https://appdividend.com/2018/02/13/vue-js-laravel-file-upload-tutorial
        if ($avatar = $request->get('_avatar')) {
          try {
            $filType = explode('/', explode(':', substr($avatar, 0, strpos($avatar, ';')))[1])[1];
            $path = time().'.'.$filType;
            Image::make($avatar)->save(public_path('files/').$path);
          } catch (\Throwable $th) {
            $avatar = false; //throw $th;
          }

          $request->delete_avatar = 1;
          if ($user->avatar) $this->destroy($request, $id);
          $user->avatar = $path;
          // $picUploaded = 'Picture Uploaded Successfully';
        } // TagUpdate: UserModule
        if ($pics=$request->get('pics')??$request->get('avatar')) { // https://github.com/Intervention/image
          foreach ($pics as $pic) {
            // $post = $request->post; try {
            //   $filType = explode('/', explode(':', substr($pic, 0, strpos($pic, ';')))[1])[1];
            //   $path = time().'.'.$filType; // https://image.intervention.io/v2/api/encode
            //   Image::make($pic)->save(public_path('files/').$path, 50, 'jpg');
            //   $picSet = 'Picture Uploaded Successfully';
            // } catch (\Throwable $th) { $path = null; }

            $picture = new Picture; $post = $request->post;

            $path = $picture->image($pic); $picData = [
              'user_id' => $id,
              'post_id' => isset($post['id'])?$post['id']:null,
              'subcategory_id' => isset($post['subcategory_id'])?$post['id']:null,
              'category_id' => isset($post['category_id'])?$post['id']:null,
              'name' => isset($post['post_title'])?$post['post_title']:null,
              'pic' => $path, //??$pic,
              'deleted' => null
            ];

            if ($request->get('avatar')) { // Profile Avatar
              $request->delete_avatar = 1; $picSet = 'Avatar Uploaded Successfully';
              if ($user->avatar) $this->destroy($request, $id);
              $user->avatar = $picData['pic'];
            } else { // Library Pictures
              $picDeleted = Pic::onlyTrashed()->whereNotNull('deleted')->first();
              $pic = Pic::where('pic', $picData['pic'])
                ->where('post_id', $picData['post_id'])
                ->first();

              if ($pic) { // Assign Existing Picture
               $pic->update($picData);
               $picSet = 'Pic Assigned Successfully';
              } elseif ($picDeleted) { // Upload Picture
                $picDeleted->restore();
                $picDeleted->update($picData);
              } else Pic::create($picData); // Add post Pictures
            }
          }
        } $user->update(); // TagUpdate: FileModule
        if (!$request->id) return response()->json([
          'success' => $picSet??'Updated Successfully',
          'user' => $user,
          // 'path' => $path
        ]);
      } elseif ($request->chat) { // Update Message
      } elseif ($id==='location') // TagCreateUpdate: LocationModule
        return $this->location($request);
      elseif ($id==='xRate') // TagUpdate: CurrencyModule
        return $this->save($request);
        return [
          'appEnv' => config('app.env'),
          'appName' => config('app.name'),
          'appDebug' => config('app.debug'),
          'appDev' => config('app.dev'),
          'production' => app()->isProduction(),
          'ipDebug' => config('app.debug'), // TagStore: IpDebugModule
          'mode' => config('mode'),
          'sanctumApi' => config('sanctumApi'),
          'user' => config('user'),
          'stateful' => config('sanctum.stateful'),
          // =============================== \\
          'laravel' => app()->version(),
          'locale' => app()->getLocale(),
          'locales' => config('app.locales'),
          'vapidPublicKey' => config('webpush.vapid.public_key'),
          'gcm_sender_id' => config('webpush.gcm.sender_id')
        ]; // TagUpdate: ConfigModule
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    { // return $id === 1;

      if ($id==='deleteAllCookies') {
        $array = array(); // TagDestroy: CookiesModule
        foreach (Cookie::get() as $key => $item) {
          // $array[] = cookie($key, null, -2628000, null, null);
          $array[] = Cookie::queue(Cookie::forget($key));
        } return $array; // back()->withCookies($array);
      } elseif ($request->pics) { // Delete Pics

        foreach ($request->pics as $pic) {

          $img = Pic::where('pic', $pic)->first();

          $imgTrashed = Pic::onlyTrashed()->whereNull('deleted')
            ->where('pic', $pic)->first(); // TagDestroy: FileModule

          if ($request?->auth) // Assign Pic To Admin
          if (($request->auth['id']==1)||($request->auth['role']=='Admin')) {
            if ($img = $imgTrashed??$img)  $img->update([
              'user_id' => $request->auth['id'], // Assign Pic To User
            ]); else return ['message' => 'Select Picture'];
          } if ($imgTrashed&&$request->forever) {
            $piCount = DB::table('pics')->where('pic', $pic)
              ->whereNull('deleted')->count();

            $file_path = public_path($imgTrashed->pic);
            if(File::exists($file_path)&&($piCount<2)) File::delete($file_path);

            $imgTrashed->update(['deleted' => 1]); // Delete Pic Forever
            // return ['success' => 'Pics Deleted Forever Successfully'];
          } elseif ($img) $img->delete(); // Delete Pic

        } return ['success' => 'Pics Deleted '.($imgTrashed?'Forever':'').' Successfully'];

        // foreach ($request->pics as $id) {

        //   $img = Pic::find($id);

        //   $imgTrashed = Pic::onlyTrashed()->whereNull('deleted')
        //     ->find($id); // TagDestroy: FileModule

        //   if ($request?->auth) // Assign Pic To Admin
        //   if (($request->auth['id']==1)||($request->auth['role']=='Admin')) {
        //     if ($img = $imgTrashed??$img)  $img->update([
        //       'user_id' => $request->auth['id'], // Assign Pic To User
        //     ]); else return ['message' => 'Select Picture'];
        //   } if ($imgTrashed&&$request->forever) {
        //     $piCount = DB::table('pics')->find($id)
        //       ->whereNull('deleted')->count();

        //     $file_path = public_path($imgTrashed->pic);
        //     if(File::exists($file_path)&&($piCount<2)) File::delete($file_path);
        //     $imgTrashed->update(['deleted' => 1]); // Delete Pic Forever
        //     return ['success' => 'Pics Deleted Forever Successfully'];
        //   } elseif ($img) $img->delete(); // Delete Pic

        // } return ['success' => 'Pics Deleted Successfully'];

      } elseif ($request->location) { // Delete Location
        $locationTrashed = Location::onlyTrashed()->find($id)?->update([
            'city' => null,
            'region' => null,
            'country' => null,
            'place' => null,
            'latitude' => null,
            'longitude' => null,
            'utc_offset' => null,
            'deleted' => 1,  // TagDestroy: LocationModule
        ]); if ($locationTrashed) return ['success' => 'Location Deleted Forever Successfully'];
        Location::destroy($id); return ['success' => 'Location Deleted Successfully'];
      } elseif ($request->currency) { // Delete Currency
        $currencyTrashed = Currency::onlyTrashed()->find($id)?->update([
            'from' => null,  // XAU
            'to' => null, // XOF
            'from_to' => null, // XAU_XOF
            'from_name' => null, // Canadian Dollar
            'to_name' => null, // West African CFA franc
            'decimal_digits' => null,
            'rate' => 0,
            'amount' => 0,
            'result' => 0,
            'deleted' => 1, // TagDestroy: CurrencyModule
        ]); if ($currencyTrashed) return ['success' => 'Currency Deleted Forever Successfully'];
        Currency::destroy($id); return ['success' => 'Currency Deleted Successfully'];
      } elseif ($request->delete_avatar) {  // Remove Image
        $user = User::find($id);
        $file_path = public_path($user->avatar);
        if(File::exists($file_path)) File::delete($file_path);
        $user->update(['avatar' => Null]);
        return [
          'success' => 'Picture Deleted Successfully',
          'User' => $user
        ]; // TagDestroy: FileModule - avatarModule
      } elseif ($request->remove) { // Remove User
        User::find($id)->update(['user_id' => null]);
        return ['success' => 'User Remove Successfully'];
      } elseif ($id === 'truncate') { // TagDestroy: truncateLocationModule
        $check = Auth::validate([
          'email'    => $request->user()->email,
          'password' => $request->password_confirmation
        ]); // return $check;
        if (!$check) return ['success' => 'Current Password Do Not Match Our Record'];
        // else return ['success' => 'Current Password Match Our Record'];
        DB::table('locations')->truncate();
        return ['success' => 'Locations Truncated Successfully'];
      }

      if ($request->delete_account) $request->authID = 'Delete Account';
      if ($id == 1 || $request->authID == $id) return ['success' => 'You Cannot Delete Super Admin or Your Own Account'];
      else { // Trash And Delete User With His Posts and Team
        $userTrashed = User::onlyTrashed()->find($id)?->update([
            'email_verified_at' => null,
            'phone' => null,
            'address' => null,
            'city' => null,
            'country' => null,
            'postal_code' => null,
            'region' => null,
            'country_code' => null,
            'locale' => null,
            'deleted' => 1,
            'user_id' => null,
            'gain' => 0,
            'credit' => 0,
            'rate' => 0,
            'currency_code' => null
        ]); // Delete User Forever
        if ($userTrashed) return ['success' => 'User Deleted Forever Successfully'];
        elseif (!$request->authID) return $request->authID;
        User::destroy($id); // Trash User
        Team::where('user_id', $id)->delete(); // Trash Team
        Post::where('user_id', $id)->delete();// TagDestroy: PostModule
        Pic::where('user_id', $id)->delete(); // TagDestroy: PictModule
        return ['success' => 'Account Deleted Successfully'];
      } // TagDestroy: UserModule

    }

    /**
     * Add Location
     *
     * @return Location
     */
    public function location($request)
    { // return $request;

      $latitude = $request->latitude??$request->lat;
      $longitude = $request->longitude??$request->lon;
      $locPl = explode(' ', isset($request->place)?$request->place:'');
      $city = strtolower($request->city??(isset($locPl[0])?$locPl[0]:''));
      $region = strtolower($request->region??(isset($locPl[1])?$locPl[1]:''));
      $country = strtolower($request->country_name??$request->country??(isset($locPl[2])?$locPl[2]:''));
      $place = strtolower($request->place??$city.' '.$region.' '.$country);

      $location = $place!='  ' ? Location::where('place', 'like', "%$place%") :
        Location::where([['city', $city], ['region', $region], ['country', $country]]);

      $location = $location->orWhere([['latitude', $latitude], ['longitude', $longitude]]);

      if (isset($request->location)) return $location->first();
      // if ($request->mutate === 'placeGetter') return $location->get();
      if (isset($request->search)) return $location->get();

      $location = $location->first(); // TagLocation: LocationModule
      $locationDeleted = Location::onlyTrashed()->whereNotNull('deleted')->first();

      if (!$location&&$locationDeleted) $locationDeleted->restore();

      $location = $location??$locationDeleted?? new Location;

      if ($city) $location->city = $city;
      if ($region) $location->region = $region;
      if ($country) $location->country = $country;
      if ($place) $location->place = $place;

      if ($request->currency) $location->currency = $request->currency;
      if ($request->currency_name) $location->currency_name = $request->currency_name;

      $location->latitude = $latitude;
      $location->longitude = $longitude;
      $location->utc_offset = $request->utc_offset??$location->utc_offset;
      $location->deleted = null;

      if ($latitude||$longitude) $location->save();

    }

    /**
     * Send Code To Email
     *
     * @return Location
     */
    public function sendCode($user)
    { //return $user;
      try {

        $seed = str_split('0123456789'); // and any other characters
        shuffle($seed); // probably optional since array_is randomized; this may be redundant
        $rand = ''; foreach (array_rand($seed, 4) as $k) $rand .= $seed[$k]; $code = $rand;

        $user->fill([
          'code' => Hash::make($code)
        ])->save(); // return $code;

        app()->setLocale($user->locale); $content = [
          'subject' => 'Account Verification',
          'title'=> 'Thank you for registering',
          'body'=> 'Please get the code below to verify your email address.',
          'code' => $code, // TagSendCode: CodeModule
        ];Mail::to($user->email)->send(new InfoSuguffie($content));

      } catch (\Throwable $th) { /* return $th; */ }
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
     * Add User To Room
     *
     * @param \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function AddUserToRoom($user_id, $room_id)
    {
      $chat = Chat::where([
        ['user_id', $user_id], // Room User
        ['room_id', $room_id]
      ])->first(); // Check If User Is Added

      $chatTrashed = Chat::onlyTrashed()->first(); $chatData = [
        'user_id' => $user_id, // Room User
        'room_id' => $room_id
      ]; // TagAddUserToRoom: MessageModule

      if (!$chat&&$chatTrashed) {
        $chatTrashed->restore();
        $chatTrashed->update($chatData);
        $chat = $chatTrashed; // Add Users' To Room
      } elseif (!$chat) $chat = Chat::create($chatData);

    }
}
