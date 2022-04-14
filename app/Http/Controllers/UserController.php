<?php

namespace App\Http\Controllers;

// use Illuminate\Foundation\Auth\AuthenticatesUsers;
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
use App\Models\Location;
use App\Models\Message;
use App\Models\Session;
use App\Models\Report;
use App\Models\User;
use App\Models\Room;
use App\Models\Chat;
use App\Models\View;
use App\Models\Team;
use App\Models\Post;
use App\Models\Pic;
// use Carbon\Carbon;
// use Session;
use Image;
use Mail;
use File;
use Hash;
use Auth;
use Log;
use DB;

/**
 * Tags: UserModule - AnalyticModule - BitgoModule - IpDebugModule - FileModule
 *       ReportModule - MessageModule - LocationModule
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
      Message::where('updated_at', '<', date('Y-m-d H:i:s', strtotime('-1 month')))->delete();
      Room::where('updated_at', '<', date('Y-m-d H:i:s', strtotime('-1 month')))->delete();
      Chat::where('updated_at', '<', date('Y-m-d H:i:s', strtotime('-1 month')))->delete();
      // Notification::where('updated_at', '<', date('Y-m-d H:i:s', strtotime('-1 day')))->delete();
      DB::table('notifications')->where('updated_at', '<', date('Y-m-d H:i:s', strtotime('-1 month')))->delete();
      // -------- TagIndex: ViewModule Delete All Views Older Than 1 Years /-1 year \\
      View::where('updated_at', '<', date('Y-m-d H:i:s', strtotime('-1 year')))->delete();
      // -------- TagIndex: UserModule Delete All Users Not Verify For 1 Years /-1 year \\
      User::whereNull('email_verified_at')->where('created_at', '<', date('Y-m-d H:i:s', strtotime('-1 year')))->delete();
      // -------- Delete All Unauthenticated Analytic Older Than 1 Years /-1 year ---\\
      Analytic::where('user_id', 0)->where('updated_at', '<', date('Y-m-d H:i:s', strtotime('-1 year')))->delete();
      // Analytic::where([['user_id', 0], ['updated_at', '<', date('Y-m-d H:i:s', strtotime('-1 year'))]])->delete();
      return 'Analytic Cron Job Done'; // TagIndex: AnalyticModule
      // ===========================or=========================
      // $analytics = Analytic::where('user_id', 0)->get();
      // $current_date = date_create(date('Y-m-d H:i:s'));
      // foreach ($analytics as $key => $analytic) { // Show Guest Analytic
      //   $analytic_updated_at = date_create($analytic->updated_at);
      //   $analytic_expiry = date_diff($current_date, $analytic_updated_at);
      //   $analytic_expiry = $analytic_expiry->format('%a'); // Analytic Expiry Date
      //   if ($analytic_expiry >= 365) $analytic->delete();
      // } return 'Analytic Cron Job Done'; // TagIndex: AnalyticModule
    } // https://laravel.com/docs/9.x/logging#writing-log-messages

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function save($request)
    {
      if ($request->ip) { // Save Analytic

        $analytic = $this->analytic; // TagSave: AnalyticModule

        if ($request->id) { // Auth Analytic
          if ($request->newAuth) {
            $analytic->session = 'NewAuth lr';
            $analytic->user_id = $request->id;
          } elseif ($analytic->ip != $request->ip) $analytic->session = 'ReturningAuthNewIP';
          else $analytic->session = 'ReturningAuth lr';
        } elseif ($request->hostUser!='undefined') { // Assign Invited User's Analytic to Host User
          $hostUser = User::where('name', $request->hostUser)->first();
          if ($hostUser) { // IP Has To Be Different
            $analytic->host_id = $hostUser->id;
            $analytic->session = 'InvitedGuest lr';
          } // TagSave: InvitedUserAnalyticModule
        } else { // Guest Analytic
          if ($analytic->user_id) $analytic->session = 'GuestRecorded lr';
          elseif ($analytic->session) $analytic->session = 'ReturningGuest lr';
          else $analytic->session = 'NewGuest lr';
        } $this->location($request); // TagSave: LocationModule

        if ($request->city) $analytic->city = $request->city;
        if ($request->region) $analytic->region = $request->region;
        if ($request->country) $analytic->country = $request->country_name??$request->country;

        if ($request->app) $analytic->app = $request->app; // App installed
        // if ($request->id) $analytic->user_id = $request->id; // Store New Auth Id To It's Guest Analytic
        if ($request->ip) $analytic->ip = $request->ip;

        $analytic->updated_at = date('Y-m-d H:i:s');
        $analytic->lat = $request->latitude??$request->lat;
        $analytic->lon = $request->longitude??$request->lon;
        $analytic->utc_offset = $request->utc_offset; $analytic->save();

        $sessions = DB::table('sessions')->where('ip_address', $request->ip());
        $sessionTrue = $sessions->update([
            // Session::where('ip_address', $request->ip())->update([
            'user_id' => $request->id
        ]); // User Sessions - https://laravel.com/docs/9.x/session

        // if (!$sessionTrue) $sessions = $sessions->first() ?? new Session;
        // if (!$sessionTrue) $sessions->save([
        //   'id' => (string) Str::uuid(),
        //   'user_id' => $request?->id,
        //   'ip_address' => $request->ip(),
        //   'user_agent' => $request->header('User-Agent')??$request->server('HTTP_USER_AGENT'),
        //   'payload' => '',
        //   'last_activity' => time()
        // ]); // E:\Apps\xampp\htdocs\www\suguffie\vendor\laravel\framework\src\Illuminate\Session

        // ----------------- TagSave: PageViewModule --------------------------- \\
        $view = View::where('slug', $request->slug)->where(function ($query) use ($request) {
            $query->where('user_id', $request->id)
                  ->orWhere('ip', $request->ip());
        })->first(); // TagSave: ViewModule

        $viewData = [
          'ip' => $request->ip(),
          'user_id' => $request->id,
          'post_id' => $request->post_id,
          'slug' => $request->slug
        ];if (!$view) {
          $viewTrashed = View::onlyTrashed()->first();
          $post = Post::find($request->post_id);
          if ($post) $post->update(['count' => $post->count+1]);
          if ($viewTrashed) {
            $viewTrashed->restore();
            $viewTrashed->update($viewData);
          } else View::create($viewData);
        } // ----------------- PageViewModule End --------------------------- \\

      }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    { //return $request->session()->all();

      if ($request->ip) { // Add Guest Analytic

        $analytic = Analytic::where('ip', $request->ip)->first();
        $analyticTrashed = Analytic::onlyTrashed()->first();

        if (!$analytic&&$analyticTrashed) $analyticTrashed->restore();

        $analytic = $analytic?->user_id?$analyticTrashed:$analytic;

        $this->analytic = $analytic ?? new Analytic; // Guest

        $this->save($request); // TagStore: AnalyticModule from axios.js

        if ($this->analytic->session=='NewGuest') return response()->json([
            'success' => 'Welcome To The World Classified Marketplace'
        ]); // New Guest Analytic IP

        if ($this->analytic->session=='InvitedGuest') return response()->json([
            'success' => 'Please Register To Fulfil Your invitation'
        ]); // Invited User's Analytic

      } elseif ($request->chat) { // Add Message - NotInUse
        // $user = User::find($request->user['id']); // Auth::user();
        $user = $request->user;

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
      } elseif ($request->id) { // Restore User
        $userTrashed = User::onlyTrashed()->where('id', $request->id)->first();
        $userTrashed->restore();
        $teamTrashed = Team::onlyTrashed()->first();
        if ($teamTrashed) {
          $teamTrashed->restore(); // Team Restore
          $teamTrashed['user_id'] = $request->id;
          $teamTrashed['name'] = $userTrashed->first_name."'s Team";
          $teamTrashed->update();
        } else $this->createTeam($userTrashed);
      } elseif ($request->log) { // Log User
        $user = User::find($request->userId);
        Auth::login($user, $remember = true);
      } elseif ($request->restorePics) { // Restore Pic
        foreach ($request->restorePics as $pic) {
          Pic::onlyTrashed()->whereNull('deleted')
            ->where('pic', $pic)
              ->restore(); // TagStore: restoreFilePostModule
        } // TagStore: FileModule
      } elseif ($request->location_id) { // Restore Location
        $locationTrashed = Location::onlyTrashed()->where('id', $request->location_id)->first();
        return $locationTrashed->restore();
      } elseif ($request->loc) // TagCreateUpdate: LocationModule
        return $this->location($request);

      if ($request->fromAnalytics) // TagFromAnalytics: LocationModule
        foreach(DB::table('analytics')->get() as $request)
         $this->location($request);

      return [
        'appEnv' => config('app.env'),
        'appDebug' => config('app.debug'),
        'sanctumApi' => config('sanctumApi'),
        'user' => config('user'),
        // =============================== \\
        'appName' => config('app.name'),
        'laravel' => app()->version(),
        'locale' => app()->getLocale(),
        'locales' => config('app.locales'),
        'ipDebug' => config('app.debug'), // TagStore: IpDebugModule
        'vapidPublicKey' => config('webpush.vapid.public_key'),
        'gcm_sender_id' => config('webpush.gcm.sender_id')
      ]; // TagStore: ConfigModule

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    { // return $request->session()->all();
      // Session::get('a');
      // return session('a');
      // return session('a', 'default');

      $pics = Pic::whereNull('deleted')->orderBy('pic', 'asc');  // Pic::all()
      $picsAchieved = Pic::onlyTrashed()->whereNull('deleted'); // Show Admins' Achieved Users
      $user = User::find($id);

      if ($request->show == 'my_pics') return // TagShow: LibraryModule;
       $pics->where('user_id', $request->auth_id)->get(); // Show Auth's Pics
      if ($request->show == 'trashed') return // TagShow: FileModule
        $picsAchieved->where('user_id', $request->auth_id)->get(); // Show Auth's Achieved Pics
      if ($request->show == 'all_pics') return $pics->get(); // TagShow: LibraryModule;
        // DB::table('pics')->whereNull('deleted')
        //   ->orderBy('pic', 'asc')->get();

      if ($request->location||$request->search) return $this->location($request); // TagShow: LocationModule

      if ($request->getUser) return $user; // Get Chat User
      elseif ($request->analytics) { // Get Users Analytics

        // return DB::table('analytics')->get();
        // return Analytic::all();

        // $analytics = DB::table('analytics')->leftJoin('users', 'users.id', 'analytics.user_id');
        $analytics = Analytic::leftJoin('users', 'users.id', 'analytics.user_id');

        // $analytics = $request->expandingRow?Analytic::leftJoin('users', 'users.id', 'analytics.user_id'):
        //                       DB::table('analytics')->leftJoin('users', 'users.id', 'analytics.user_id');

        $analytics->whereNull('analytics.deleted_at')->select('users.*','analytics.*'); // return '$request';

        if ($request->proxyDate) $analytics->whereDate('analytics.updated_at', $request->proxyDate)
          ->orWhereBetween('analytics.updated_at', [$request->from, $request->to]);
        if ($request->period) $analytics->whereBetween('analytics.updated_at', [date('Y-m-d H:i:s', strtotime($request->period)), date('Y-m-d H:i:s')]);
        return $analytics->get(); // TagShow: AnalyticModule from Analytics.vue
      } elseif ($request->views) { // Get Posts views

        $views = View::join('analytics', function ($join) {
            $join->on('analytics.user_id', 'views.user_id')
              ->orOn('analytics.ip', 'views.ip')
              ->where('analytics.user_id', 0);
        });

        if ($request->proxyDate) $views->whereDate('views.updated_at', $request->proxyDate)
          ->orWhereBetween('views.updated_at', [$request->from, $request->to]);
        if ($request->period) $views->whereBetween('views.updated_at', [date('Y-m-d H:i:s', strtotime($request->period)), date('Y-m-d H:i:s')]);
        return $views->get(); // TagShow: ViewModule
      } elseif ($request->reports) { // Get Users reports

        // $reports = DB::table('reports')->whereNotNull('start_date');
        $reports = Report::whereNotNull('start_date'); //return 'reports';

        if ($request->role == 'User') $reports->where('user_id', $request->id);

        if ($request->proxyDate) $reports->whereDate('updated_at', $request->proxyDate)
          ->orWhereBetween('updated_at', [$request->from, $request->to]);
        if ($request->period) $reports->whereBetween('updated_at', [date('Y-m-d H:i:s', strtotime($request->period)), date('Y-m-d H:i:s')]);
        return $reports->get();// TagShow: ReportModule
      } if ($request->avatar) $request->avatar->new['avatar']; // Show User Avatar

      if ($request->usersData == 'my_users') return User::where('user_id', $id)->get(); // Show User's Users  // TagShow: UserModule
      elseif ($request->usersData == 'trashed') return User::onlyTrashed()->whereNull('deleted')->get(); // Show Admins' Achieved Users
      elseif ($request->usersData == 'users') return User::whereNull(['deleted_at', 'deleted'])->get(); // Show Admins' Users
      elseif ($request->locationsData == 'locations') return Location::get(); // Show Locations
      elseif ($request->locationsData == 'trashed') return Location::onlyTrashed()->whereNull('deleted')->get(); // Show Trashed location
      // elseif ($request->usersData == 'users') return DB::table('users')->whereNull(['deleted_at', 'deleted'])->get(); // Show Admins' Users

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
    { //return$request;

      if ($request->ip) { // Update Auth And Guest Analytic

        $this->analytic = Analytic::where('user_id', $request->id)->first(); // Auth
        $request->newAuth = !$this->analytic; // Store New Auth Id To It's Guest Analytic

        if ($this->analytic) $this->save($request); // If Auth Analytic Exist
        else $this->store($request); // TagUpdate: AnalyticModule from axios.js

        $guest_analytic_ip = Analytic::where([['ip', $this->analytic->ip], ['user_id', 0]])
          ->first(); // Check If Auth Guest Old IP Exists

        if ($guest_analytic_ip) {
          if ($guest_analytic_ip->host_id) User::find($request->id)->update([ // Invited User
              'user_id' => $guest_analytic_ip->host_id // Assign Invited User To Host user
          ]); $guest_analytic_ip->delete(); // Replace Old To The New IP And Delete It's Guest IP
        } // TagUpdate: AssignInvitedUserAnalyticModule

        if ($this->analytic->session=='NewAuth') return response()->json([
            'success' => "Great!!! Don't Forget To Update Your Profile"
        ]); // Invited User's Analytic

        return [
          'ip' => $request->ip(),
          // 'session' => $value = $request->session()->get('key'), // TODO https://laravel.com/docs/8.x/session#interacting-with-the-session
          // 'user' => $request->user()
        ];
      } elseif ($request->update) { // Update Users
        $put = User::find($id); //$picUploaded = false;
        $check = Auth::validate([
            'email'    => $put->email,
            'password' => $request->password
        ]); $file = $request->file('avatar');
        if ($put->deleted) $put->deleted = Null;
        if ($request->email && $request->admin) $put->email = $request->email;
        if ($request->name) {
          $this->validate($request, [
              'name' => 'required|string|max:255|unique:users'
          ]); $put->name = $request->name;
        } // TagUpdate: UserNameModule
        if ($request->first_name) $put->first_name = $request->first_name;
        if ($request->last_name) $put->last_name = $request->last_name;
        if ($request->phone) $put->phone = $request->phone;
        if ($request->address) $put->address = $request->address;
        if ($request->city) $put->city = $request->city;
        if ($request->postal_code) $put->postal_code = $request->postal_code;
        if ($request->region_code) $put->region_code = $request->region_code;
        if ($request->country_code) $put->country_code = $request->country_code;
        if ($request->country) $put->country = $request->country;
        if ($request->role) $put->role = $request->role;
        if ($request->signature) $put->email_verified_at = date('Y-m-d H:i:s');
        if ($request->pwd || $request->update_password || $request->update_email) {
          if ($request->update_password) $request->new_password = $check = $request->update_password; // Admin Update Password
          if ($request->email && $request->update_email) $put->email = $request->email;
          if (!$check) return ['success' => 'Current Password Do Not Match Our Record'];
          if (!$request->new_password || $request->new_password != $request->password_confirmation)
          if (!$request->update_email) return ['success' => 'Password Confirmation Do Not Match'];
          if (!$request->update_email) $put->password = bcrypt($request->new_password);
        } // Update Password or Email
        if ($request->hasFile('avatar')) {
          $fileName = $id.'.png'; // $file->getClientOriginalName();
          $path = $file->storeAs('files/', $fileName);
          $file->move('files/', $fileName);
          $put->avatar = $path;
        } // https://appdividend.com/2018/02/13/vue-js-laravel-file-upload-tutorial
        if ($request->get('avatar')) {
          $avatar = $request->avatar;
          $type = explode('/', explode(':', substr($avatar, 0, strpos($avatar, ';')))[1])[1];
          $fileName = time().'.'.$type;
          Image::make($avatar)->save(public_path('files/').$fileName);
          $request->delete_avatar = 1;
          if ($put->avatar) $this->destroy($request, $id);
          $put->avatar = 'files/'.$fileName;
          $picUploaded = 'Picture Uploaded Successfully';
        } $put->update(); // TagUpdate: UserModule
        if ($request->get('pics')) { // https://github.com/Intervention/image
          foreach ($request->pics as $pic) {
            $post = $request->post; try {
              $name = time().'.' . explode('/', explode(':', substr($pic, 0, strpos($pic, ';')))[1])[1];
              Image::make($pic)->save(public_path('files/').$name, 80, 'jpg');
            } catch (\Throwable $th) { $name = false; } // https://image.intervention.io/v2/api/encode

            $picData = [
              'post_id' => isset($post['id'])?$post['id']:0,
              'subcategory_id' => isset($post['subcategory_id'])?$post['id']:0,
              'category_id' => isset($post['category_id'])?$post['id']:0,
              'user_id' => $id,
              'name' => isset($post['post_title'])?$post['post_title']:null,
              'pic' => $name?'files/'.$name:$pic,
              'deleted' => null
            ];$picDeleted = Pic::onlyTrashed()->whereNotNull('deleted')->first();

            $pic = Pic::where('pic', $pic)
              ->where('post_id', $picData['post_id'])
              ->first();
            // $pic = Pic::where([['pic', $pic], ['post_id', $request->post_id]])->first();

            if ($pic) $pic->update($picData); // Assign Existing Pic
            elseif ($picDeleted) {
              $picDeleted->restore();
              $picDeleted->update($picData);
            } else Pic::create($picData); // Add post Pictures

          } $picUploaded = 'Picture Uploaded Successfully';
        } // TagUpdate: FileModule
        return response()->json([
          'success' => $picUploaded??'Updated Successfully',
          'user' => $put
        ]);
      } elseif ($request->chat) { // Update Message
      }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    { //return $id;

      if ($request->pics) { // Delete Pics

        foreach ($request->pics as $pic) {

          $img = Pic::where('pic', $pic)->first();

          $imgTrashed = Pic::onlyTrashed()->whereNull('deleted')
            ->where('pic', $pic)->first();

          if ($request?->auth)
          if (($request->auth['id']==1)||($request->auth['role']=='Admin')) {
            $img = $imgTrashed?$imgTrashed:$img;  $img->update([
              'user_id' => $request->auth['id'],
            ]);
          } // Assign Pic To User

          if ($imgTrashed&&$request->forever) {
            $piCount = DB::table('pics')->where('pic', $pic)
              ->whereNull('deleted')->count();

            $file_path = public_path($imgTrashed->pic);
            if(File::exists($file_path)&&($piCount<2)) File::delete($file_path);
            $imgTrashed->update(['deleted' => 1]); // Delete Forever Pic
          } else $img->delete(); // Delete Pic

        } return 'Pics Deleted Successfully';

      } // TagDestroy: FileModule

      if ($request->location) { // Delete Location
        $locationTrashed = Location::onlyTrashed()->where('id', $id)->update([
            'city' => null,
            'region' => null,
            'country' => null,
            'place' => null,
            'lat' => null,
            'lon' => null,
            'latitude' => null,
            'longitude' => null,
            'utc_offset' => null,
            'deleted' => 1,
        ]); if ($locationTrashed) return ['success' => 'Location Deleted Forever Successfully'];
        Location::destroy($id); // return $this->location($request);
        return ['success' => 'Location Deleted Successfully'];
      } // TagDestroy: LocationModule

      if ($id == 'truncate') // TagDestroy: truncateLocationModule
        return DB::table('locations')->truncate();

      if ($request->delete_avatar) {
        $user = User::find($id);
        $file_path = public_path($user->avatar);
        if(File::exists($file_path)) File::delete($file_path);
        // $user = User::where('id', $id);
        $user->update(['avatar' => Null]);
        return [
          'success' => 'Image Deleted Successfully',
          'user' => $user
          // 'user' => $user->first()
        ];
      } // Remove Image
      if ($id == 1 || $request->authID == $id) return ['success' => 'You Cannot Delete Super Admin or Your Own Account'];
      else {
        $userTrashed = User::onlyTrashed()->where('id', $id)->update([
            'email_verified_at' => null,
            'phone' => null,
            'address' => null,
            'city' => null,
            'country' => null,
            'postal_code' => null,
            'region_code' => null,
            'country_code' => null,
            'position' => null,
            'deleted' => 1,
            'user_id' => 0,
            'gain' => 0
        ]); if ($userTrashed) return ['success' => 'User Deleted Forever Successfully'];
        elseif (!$request->authID) return;
        User::destroy($id); // Trash User
        Team::where('user_id', $id)->delete(); // Trash Team
        $posts = Post::where('user_id', $id)->get();// TagDestroy: PostModule
        foreach ($posts as $post) $post->delete(); // Delete User Posts
        return ['success' => 'User Deleted Successfully'];
      } // TagDestroy: UserModule

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
     * Add Location
     *
     * @return Location
     */
    public function location($request)
    { // return $request;

      $latitude = $this->latitude = $request->latitude??$request->lat;
      $longitude = $this->longitude = $request->longitude??$request->lon;
      $lat = $this->lat = $latitude==null?null:intval($latitude);
      $lon = $this->lon = $longitude==null?null:intval($longitude);
      $city = strtolower($request->city);
      $region = strtolower($request->region);
      $country = strtolower($request->country_name??$request->country);
      $place = $this->place = $request->place??$city.' '.$region.' '.$country;

      $location = Location::where([['latitude', $latitude], ['longitude', $longitude]])
        ->orWhere(function ($query) use ($request) {
          $query->where([['lat', $this->lat], ['lon', $this->lon]]);
          if ($this->place!='  ') $query->orWhere('place', 'like', "%$this->place%");
      }); // TagLocation: LocationModule

      if (isset($request->location)) { // return $request;
        $location = $location->first(); $id = $location?->id;
        // Log::warning('$id '.$location?->place=='  ');
        if ($location?->place=='  ') $this->destroy($request, $id);
        else return $location;
      } if (isset($request->search)) return $location->get();

      $location = $location->first(); //->whereNotNull('latitude')
      $locationDeleted = Location::onlyTrashed()->whereNotNull('deleted')->first();

      if (!$location&&$locationDeleted) $locationDeleted->restore();

      $location = $location??$locationDeleted??new Location;

      if ($city) $location->city = $city;
      if ($region) $location->region = $region;
      if ($country) $location->country = $country;
      if ($place) $location->place = $place;

      $location->lat = $lat;
      $location->lon = $lon;
      $location->latitude = $latitude;
      $location->longitude = $longitude;
      $location->utc_offset = $request->utc_offset;
      $location->deleted = null;
      if ($lat||$lon) $location->save();

    }
}
