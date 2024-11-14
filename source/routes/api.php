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
            Route::get('daftarkelas', [MasterDataController::class,"getkelas"]);
            Route::get('jenispembayaran', [MasterDataController::class,"getjenispembayaran"]);
            Route::post('tambahkeranjangtagihan', [MasterDataController::class,"tambahkeranjangtagihan"]);
            Route::get('hapustagihanpeserta', [MasterDataController::class,"hapustagihanpeserta"]);
        });
        Route::prefix('spp')->group(function () {
            Route::get('daftar_tagihan', [SppController::class,"gettagihan"]);
            Route::post('transaksispp', [SppController::class,"transaksispp"]);
            Route::get('daftar_pembayaran', [SppController::class,"getpembayaran"]);
            Route::get('detail_transaksi', [SppController::class,"detailtransaksi"]);
            Route::get('detail_transaksi_id', [SppController::class,"detailtransaksiid"]);
            Route::get('hapus_pembayaran', [SppController::class,"hapuspembayaran"]);
            Route::post('simpantagihan', [SppController::class,"simpantagihan"]);
            Route::get('editdaftartagihan', [SppController::class,"editdaftartagihan"]);
            Route::post('updatetagihan', [SppController::class,"updatetagihan"]);
        });
    });
});
