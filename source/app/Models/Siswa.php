<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
class Siswa extends Model
{
    protected $table = 'siswa_buku_induk';
    protected $fillable = [
        'id_kelas',
        'id_jurusan',
        'tahun_ajaran',
        'nis',
        'nisn',
        'nama_siswa',
        'alamat_siswa',
    ];
    public static function getSiswa($req, $perHalaman, $offset){
        $parameterpencarian = $req->parameter_pencarian;
        $tablePrefix = config('database.connections.mysql.prefix');
        $query = DB::table((new self())->getTable())
            ->select('siswa_buku_induk.*');
        if (!empty($parameterpencarian)) {
            $query->where('nis', 'LIKE', '%' . $parameterpencarian . '%')
                  ->orWhere('nama_siswa', 'LIKE', '%' . $parameterpencarian . '%');
        }
        $result = $query->take($perHalaman)
            ->skip($offset)
            ->orderBy('nama_siswa', 'ASC')
            ->get();
        $jumlahdata = $query->count();
        return [
            'data' => $result,
            'total' => $jumlahdata
        ];
    }
}
