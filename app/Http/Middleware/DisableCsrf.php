<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DisableCsrf
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
	$request->headers->remove('X-CSRF-TOKEN');
        $request->headers->remove('X-XSRF-TOKEN');
        $request->session()->forget('_token');
	
       
 return $next($request);
    }
}
