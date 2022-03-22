<?php

namespace App\Http\Middleware;

use Closure;
use Auth;
class Admincheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(Auth::check() && (Auth::user()->role == 'Admin' || Auth::user()->role == 'Super Admin')) {
            return $next($request);
        }
        else
            return abort(403);
        
    }
}
