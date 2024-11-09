<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{AuthController, RoleAndPermissionController, UserController, SppController, MasterDataController};

Route::get('/', function(){return ResponseHelper::error(401);})->name('login');
Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('pintupendaftaran', [AuthController::class,"register"]);
        Route::post('pintumasuk', [AuthController::class,"login"]);
        Route::post('buattokenbaru', [AuthController::class,"refreshToken"]);
        Route::post('keluar', [AuthController::class,"logout"]);
        Route::post('tambahakses', [RoleAndPermissionController::class,"addpermission"]);
    });
    Route::middleware(['jwt.cookie'])->group(function () {
        Route::prefix('pengguna')->group(function () {
            Route::post('tambahpengguna', [UserController::class,"adduser"]);
            Route::get('daftarpengguna', [UserController::class,"getuser"]);
            Route::get('hapuspengguna', [UserController::class,"deleteuser"]);
            Route::get('detailpengguna', [UserController::class,"detailuser"]);
            Route::post('editpengguna', [UserController::class,"edituser"]);
        });
        Route::prefix('permission')->group(function () {
            Route::post('tambahhakakses', [RoleAndPermissionController::class,"addpermission"]);
            Route::get('daftarhakakses', [RoleAndPermissionController::class,"getpermission"]);
            Route::get('hapushakakses', [RoleAndPermissionController::class,"deletepermission"]);
            Route::post('edithakakses', [RoleAndPermissionController::class,"editpermission"]);
        });
        Route::prefix('role')->group(function () {
            Route::post('tambahrole', [RoleAndPermissionController::class,"addrole"]);
            Route::get('daftarrole', [RoleAndPermissionController::class,"getrole"]);
            Route::get('hapusrole', [RoleAndPermissionController::class,"deleterole"]);
            Route::get('detailrole', [RoleAndPermissionController::class,"detailrole"]);
            Route::post('editrole', [RoleAndPermissionController::class,"editrole"]);
        });
        Route::prefix('masterdata')->group(function () {
            Route::get('daftarsiswa', [MasterDataController::class,"getsiswa"]);
            Route::get('jenispembayaran', [MasterDataController::class,"getjenispembayaran"]);
        });
        Route::prefix('spp')->group(function () {
            Route::get('daftar_tagihan', [SppController::class,"gettagihan"]);
        });
    });
});
