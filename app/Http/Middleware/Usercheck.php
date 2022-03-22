<?php

namespace App\Http\Middleware;

use Closure;
use Auth;
class Usercheck
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
        if(Auth::check() && Auth::user()->role <> 'Member' && Auth::user()->role <> 'Vendor' && !is_null(Auth::user()->role)) {
        return $next($request);
        }
        else
            return abort(403);
        
    }
}
