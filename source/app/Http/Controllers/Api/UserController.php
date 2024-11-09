<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\ResponseHelper;
use App\Models\User;
use Illuminate\Support\Facades\{Validator, Hash};
use App\Services\UserServices;


class UserController extends Controller
{
    public function getuser(Request $request){
        try {   
            $perHalaman = (int) $request->length > 0 ? (int) $request->length : 1;
            $nomorHalaman = (int) $request->start / $perHalaman;
            $offset = $nomorHalaman * $perHalaman; 
            $datatabel = User::userInformation($request, $perHalaman, $offset);
            $jumlahdata = $datatabel['total'];
            $dynamicAttributes = [
                'data' => $datatabel['data'],
                'recordsFiltered' => $jumlahdata,
                'pages' => [
                    'limit' => $perHalaman,
                    'offset' => $offset,
                ],
            ];
            return ResponseHelper::data(__('common.data_ready', ['namadata' => 'Informasi Pengguna Aplikasi MCU Artha Medica']), $dynamicAttributes);
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function adduser(UserServices $registerService,Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|min:8|max:255|unique:users,username',
                'password' => 'required|string|min:8',
                'email' => 'required|string|email|unique:users,email',
                'idhakakses' => 'required|string',
                'nama_pegawai' => 'required|string',
                'nik' => 'required|string',
                'jabatan' => 'required|string',
                'departemen' => 'required|string',
                'tanggal_lahir' => 'required|date_format:d-m-Y',
                'tempat_lahir' => 'required|string',
                'jenis_kelamin' => 'required|string',
                'alamat' => 'required',
                'no_telepon' => 'required|string',
                'status_pegawai' => 'required|string',
            ]);
            if ($validator->fails()) {
                $dynamicAttributes = ['errors' => $validator->errors()];
                return ResponseHelper::error_validation(__('auth.eds_required_data'), $dynamicAttributes);
            }
            $data = $request->all();
            $ttd = $request->file('tanda_tangan_pegawai');
            $registerService->handleTransactionRegisterUser($data, $ttd);
            return ResponseHelper::success('Pengguna ' . $request->input('nama_pegawai') . ' berhasil didaftarkan kedalam sistem MCU Artha Medica.');
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function deleteuser(UserServices $userService, Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'id' => 'required',
            ]);
            if ($validator->fails()) {
                $dynamicAttributes = ['errors' => $validator->errors()];
                return ResponseHelper::error_validation(__('auth.eds_required_data'), $dynamicAttributes);
            }
            $data = $request->all();
            $userService->handleTransactionDeleteUser($data);
            return ResponseHelper::success('Pengguna ' . $request->input('username') . ' berhasil dihapus dari sistem MCU Artha Medica.');
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function detailuser(Request $request){
       try {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'username' => 'required',
        ]);
        if ($validator->fails()) {
            $dynamicAttributes = ['errors' => $validator->errors()];
            return ResponseHelper::error_validation(__('auth.eds_required_data'), $dynamicAttributes);
        }
        $detailuser = User::detailUser($request);
        $dynamicAttributes = [
            'data' => $detailuser,
        ];
        return ResponseHelper::data(__('common.data_ready', ['namadata' => 'Informasi Detail Pengguna ' . $detailuser->nama_pegawai . ' Aplikasi MCU Artha Medica']), $dynamicAttributes);
       } catch (\Throwable $th) {
        return ResponseHelper::error($th);
       }
    }
    public function edituser(UserServices $userService, Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'id_pengguna' => 'required',
            ]);
            if ($validator->fails()) {
                $dynamicAttributes = ['errors' => $validator->errors()];
                return ResponseHelper::error_validation(__('auth.eds_required_data'), $dynamicAttributes);
            }
            $data = $request->all();
            $ttd = $request->file('tanda_tangan_pegawai');
            $userService->handleTransactionEditUser($data, $ttd);
            return ResponseHelper::success('Pengguna ' . $request->input('nama_pegawai') . ' berhasil diubah. Silahkan masukkan kembali pada halaman pengguna aplikasi MCU Artha Medica.');
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
}
