<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Jetstream\HasProfilePhoto;
use Laravel\Jetstream\HasTeams;
use Laravel\Sanctum\HasApiTokens;
// use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use NotificationChannels\WebPush\HasPushSubscriptions;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens;
    use HasFactory;
    use HasProfilePhoto;
    use HasTeams;
    use Notifiable;
    use HasPushSubscriptions;
    // use TwoFactorAuthenticatable;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
      'user_id',
      'gain',
      'first_name',
      'last_name',
      'name',
      'email',
      'email_verified_at',
      'phone',
      'address',
      'city',
      'country',
      'postal_code',
      'region_code',
      'country_code',
      'position',
      'password',
      'user_id',
      'role',
      'position',
      'status',
      'avatar',
      'deleted'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
      'password',
      'remember_token',
      'two_factor_recovery_codes',
      'two_factor_secret',
    ];

    /**
     * Validate the password of the user for the Passport password grant.
     *
     * @param  string  $password
     * @return bool
     */
    // public function validateForPassportPasswordGrant($password)
    // {
    //     return Hash::check($password, $this->password);
    // }

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'profile_photo_url',
        'new', //'posts'//, 'messages'
    ];

    /**
     * Get the profile photo URL attribute.
     *
     * @return string
     */
    public function getNewAttribute()
    {
        return [
          'avatar' => 'https://www.gravatar.com/avatar/'.md5(strtolower($this->email)).'.jpg?s=200&d=mm'
        ];
    }

    /**
     * Get the default profile photo URL if no profile photo has been uploaded.
     *
     * @return string
     */
    protected function defaultProfilePhotoUrl()
    {
        return 'https://ui-avatars.com/api/?name='.urlencode($this->first_name.' '.$this->last_name).'&color=7F9CF5&background=EBF4FF';
    }

    /**
     * Get user's posts
     */
    public function posts()
    // public function getPostsAttribute()
    {
      // return $this->hasMany(Post::class)->get();
      return $this->hasMany(Post::class);
    }

    /**
     * A user can have many messages
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function chat()
    {
        return $this->hasMany(Room::class);
    }

    /**
     * A user can have many messages
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Get user's analytics
     */
    public function analytics()
    {
        return $this->hasMany('App\Models\Analytic');
        // return $this->hasOne('App\Models\Analytic');
    }

    /**
     * Get user's favorites
     */
    public function favorites()
    {
        return $this->hasMany(Favorite::class)->where('wish', 1);
    }
}
