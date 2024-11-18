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
            ->join('atr_kelas', 'atr_kelas.id', '=', 'siswa_buku_induk.id_kelas')
            ->join('siswa_tahun_ajaran', 'siswa_tahun_ajaran.id_tahun_ajaran', '=', 'siswa_buku_induk.id_tahun_ajaran')
            ->select('siswa_buku_induk.*','siswa_buku_induk.id as id_siswa', 'atr_kelas.*', 'siswa_tahun_ajaran.*','siswa_tahun_ajaran.id_tahun_ajaran as kode_tahun_ajaran');
        if (!empty($parameterpencarian)) {
            $query->where('nis', 'LIKE', '%' . $parameterpencarian . '%')
                  ->orWhere('nama_siswa', 'LIKE', '%' . $parameterpencarian . '%');
        }
        $jumlahdata = $query->count();
        $result = $query->take($perHalaman)
            ->skip($offset)
            ->orderBy('nama_siswa', 'ASC')
            ->get();
        return [
            'data' => $result,
            'total' => $jumlahdata
        ];
    }
}
