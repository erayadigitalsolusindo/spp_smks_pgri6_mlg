<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Hash,Cookie,Validator};
use App\Models\{User};
use App\Helpers\{ResponseHelper,GlobalHelper};
use Tymon\JWTAuth\Facades\JWTAuth;


class AuthController extends Controller
{
    public function login(Request $req){
        try {
            $validator = Validator::make($req->all(), [
                'username' => 'required|string',
                'password' => 'required|string',
            ]);
            if ($validator->fails()) {
                $dynamicAttributes = ['errors' => $validator->errors()];
                return ResponseHelper::error_validation(__('auth.eds_required_data'), $dynamicAttributes);
            }
            $credentials = $req->only('username', 'password');
            if (!$token = JWTAuth::attempt($credentials)) {
                return ResponseHelper::data_not_found(__('auth.eds_invalid_credentials'));
            }
            $user = JWTAuth::user();
            $dynamicAttributes = [
                'user_information' => $user,
                'token_akses' => $token,
            ];
            $cookie_jwt = Cookie::make('token_device', $token, env('COOKIE_TIME_EXPIRE'), env('COOKIE_PATH'), env('COOKIE_DOMAIN_ALLOWED'), env('COOKIE_IS_SECURE'), env('COOKIE_IS_HTTP_ONLY'));
            return ResponseHelper::success(__('auth.eds_login_successful'), $dynamicAttributes)->withCookie($cookie_jwt);
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
}
