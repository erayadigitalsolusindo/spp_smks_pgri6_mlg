<?php

namespace App\Services;

use Illuminate\Support\Facades\{DB, Hash, Storage};
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\{User, Pegawai};
use Spatie\Permission\Models\Role;

use Exception;

class UserServices
{
    /**
     * Handle database transaction.
     *
     * @param array $data
     * @return mixed
     * @throws \Exception
     */
    public function handleTransactionRegisterUser($data, $ttd)
    {
        return DB::transaction(function () use ($data, $ttd) {
            $uuid = (string) Str::uuid();
            $filename = "";
            if ($ttd) {
                $originalName = $ttd->getClientOriginalName();
                $sanitizedName = strtolower(preg_replace('/[\s\W_]+/', '_', $originalName));
                $timestamp = microtime(true);
                $filename = $uuid . '_' . $sanitizedName . '_' . $timestamp . '.' . $ttd->getClientOriginalExtension();
            }
            $users = [
                'uuid' => $uuid,
                'username' => $data['username'] ?? '',
                'email' => $data['email'] ?? '',
                'email_verified_at' => now(),
                'password' => Hash::make($data['password']),
            ];
            User::create($users);
            $userdata = User::where('username', $data['username'])->first();
            User::assignRole($data['idhakakses'], $userdata->id);
            $employed = [
                'id' => $userdata->id,
                'nama_pegawai' => $data['nama_pegawai'] ?? '',
                'nik' => $data['nik'] ?? '',
                'jabatan' => $data['jabatan'] ?? '',
                'departemen' => $data['departemen'] ?? '',
                'tanggal_lahir' => (!empty($data['tanggal_lahir']) ? Carbon::createFromFormat('d-m-Y', $data['tanggal_lahir'])->format('Y-m-d') : null),
                'tempat_lahir' => $data['tempat_lahir'] ?? '',
                'jenis_kelamin' => $data['jenis_kelamin'] ?? 'Laki-Laki',
                'alamat' => $data['alamat'] ?? '',
                'no_telepon' => $data['no_telepon'] ?? '',
                'tanggal_bergabung' => (!empty($data['tanggal_diterima']) ? Carbon::createFromFormat('d-m-Y', $data['tanggal_diterima'])->format('Y-m-d') : null),
                'tanggal_berhenti' => (!empty($data['tanggal_berhenti']) ? Carbon::createFromFormat('d-m-Y', $data['tanggal_berhenti'])->format('Y-m-d') : null),
                'status_pegawai' => $data['status_pegawai'] ?? '',
                'tanda_tangan_pegawai' => $filename,

            ];              
            $pegawai = Pegawai::create($employed);
            if($pegawai && $ttd){
                Storage::disk('public')->putFileAs('user/ttd/', $ttd, $filename);
            }
        });
    }
    public function handleTransactionDeleteUser($data){
        return DB::transaction(function () use ($data) {
            $tanda_tangan = Pegawai::where('id', '=', $data['id'])->first();
            User::where('id', '=', $data['id'])->delete();
            Pegawai::where('id', '=', $data['id'])->delete();
            User::deleteRole($data['id']);
            Storage::disk('public')->delete('user/ttd/' . $tanda_tangan->tanda_tangan_pegawai);
        });
    }
    public function handleTransactionEditUser($data, $ttd){
        return DB::transaction(function () use ($data, $ttd) {
            $datauser = [
                'username' => $data['username'] ?? '',
                'email' => $data['email'] ?? '',
            ];
            if (!empty($data['password'])) {
                $datauser['password'] = Hash::make($data['password']);
            }
            User::where('id', '=', $data['id_pengguna'])->update($datauser);
            $datapegawai = [
                'nama_pegawai' => $data['nama_pegawai'] ?? '',
                'nik' => $data['nik'] ?? '',
                'jabatan' => $data['jabatan'] ?? '',
                'departemen' => $data['departemen'] ?? '',
                'tanggal_lahir' => (!empty($data['tanggal_lahir']) ? Carbon::createFromFormat('d-m-Y', $data['tanggal_lahir'])->format('Y-m-d') : null),
                'tempat_lahir' => $data['tempat_lahir'] ?? '',
                'jenis_kelamin' => $data['jenis_kelamin'] ?? 'Laki-Laki',
                'alamat' => $data['alamat'] ?? '',
                'no_telepon' => $data['no_telepon'] ?? '',
                'tanggal_bergabung' => (!empty($data['tanggal_diterima']) ? Carbon::createFromFormat('d-m-Y', $data['tanggal_diterima'])->format('Y-m-d') : null),
                'tanggal_berhenti' => (!empty($data['tanggal_berhenti']) ? Carbon::createFromFormat('d-m-Y', $data['tanggal_berhenti'])->format('Y-m-d') : null),
                'status_pegawai' => $data['status_pegawai'] ?? '',
            ];
            if ($ttd) {
                $originalName = $ttd->getClientOriginalName();
                $sanitizedName = strtolower(preg_replace('/[\s\W_]+/', '_', $originalName));
                $timestamp = microtime(true);
                $filename = (string) Str::uuid() . '_' . $sanitizedName . '_' . $timestamp . '.' . $ttd->getClientOriginalExtension();
                $datapegawai['tanda_tangan_pegawai'] = $filename;
            }
            $tanda_tangan = Pegawai::where('id', '=', $data['id_pengguna'])->first();
            Pegawai::where('id', '=', $data['id_pengguna'])->update($datapegawai);
            User::assignRole($data['idhakakses'], $data['id_pengguna']);
            if (isset($ttd)) {
                Storage::disk('public')->delete('user/ttd/' . $tanda_tangan->tanda_tangan_pegawai);
                Storage::disk('public')->putFileAs('user/ttd/', $ttd, $filename);
            }
        });
    }
}
