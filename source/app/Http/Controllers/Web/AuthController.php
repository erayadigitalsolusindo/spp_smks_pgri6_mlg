<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function logout(Request $request)
    {
      $token = $request->attributes->get('token_device');
      if ($token) JWTAuth::setToken($token)->invalidate();
      $request->attributes->remove('user_details');
      $request->attributes->remove('token_device');
      return redirect('/')->withCookie(Cookie::forget('token_device'));
    }
}
