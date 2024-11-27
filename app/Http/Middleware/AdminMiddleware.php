<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (auth()->user() && auth()->user()->esAdmin()) {
            return $next($request);
        }

        return redirect('/')->with('error', 'No tienes acceso a esta página.');
    }
}
