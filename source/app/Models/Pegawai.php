<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pegawai extends Model
{
    protected $table = 'users_pegawai';
    protected $fillable = [
        'id',
        'nama_pegawai',
        'nik',
        'jabatan',
        'departemen',
        'tanggal_lahir',
        'tempat_lahir',
        'jenis_kelamin',
        'alamat',
        'no_telepon',
        'tanggal_bergabung',
        'tanggal_berhenti',
        'status_pegawai',
        'tanda_tangan_pegawai',
    ];
}
