<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Tagihan extends Model
{
    protected $table = 'siswa_tagihan';

    protected $fillable = [
        'nis',
        'juli',
        'agustus',
        'september',
        'oktober',
        'november',
        'desember',
        'januari',
        'februari',
        'maret',
        'april',
        'mei',
        'juni',
        'tahun_ajaran',
    ];
    public static function listTagihanTabel($req, $perHalaman, $offset)
    {
        $parameterpencarian = $req->parameter_pencarian;
        $query = DB::table((new self())->getTable())
        ->join('siswa_buku_induk', 'siswa_buku_induk.nis', '=', 'siswa_tagihan.nis')
        ->join('atr_kelas', 'atr_kelas.id', '=', 'siswa_buku_induk.id_kelas')
        ->join('atr_jurusan', 'atr_jurusan.id', '=', 'siswa_buku_induk.id_jurusan');
        if (!empty($parameterpencarian)) {
            $query->where('siswa_tagihan.nis', 'LIKE', '%' . $parameterpencarian . '%')
                ->orWhere('siswa_buku_induk.nama_siswa', 'LIKE', '%' . $parameterpencarian . '%');
        }
        $result = $query->take($perHalaman)
            ->skip($offset)
            ->orderBy('siswa_tagihan.nis', 'ASC')
            ->get();
        $jumlahdata = $query->count();
        return [
            'data' => $result,
            'total' => $jumlahdata
        ];
    }
}
