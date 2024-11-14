<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
class Tagihan extends Model
{
    protected $table = 'siswa_tagihan';

    protected $fillable = [
        'nis',
        'juli',
        'total_tagihan_juli',
        'agustus',
        'total_tagihan_agustus',
        'september',
        'total_tagihan_september',
        'oktober',
        'total_tagihan_oktober',
        'november',
        'total_tagihan_november',
        'desember',
        'total_tagihan_desember',
        'januari',
        'total_tagihan_januari',
        'februari',
        'total_tagihan_februari',
        'maret',
        'total_tagihan_maret',
        'april',
        'total_tagihan_april',
        'mei',
        'total_tagihan_mei',
        'juni',
        'total_tagihan_juni',
        'tahun_ajaran',
    ];
    public static function listTagihanTabel($req, $perHalaman, $offset)
    {
        $parameterpencarian = $req->parameter_pencarian;
        $query = DB::table((new self())->getTable())
        ->join('siswa_buku_induk', 'siswa_buku_induk.id', '=', 'siswa_tagihan.nis')
        ->join('atr_kelas', 'atr_kelas.id', '=', 'siswa_buku_induk.id_kelas')
        ->select('siswa_buku_induk.id as id_siswa', 'siswa_tagihan.*', 'siswa_buku_induk.nis', 'siswa_buku_induk.nama_siswa', 'atr_kelas.tingkat_kelas');
        if (!empty($parameterpencarian)) {
            $query->where('siswa_buku_induk.nis', 'LIKE', '%' . $parameterpencarian . '%')
                ->orWhere('siswa_buku_induk.nama_siswa', 'LIKE', '%' . $parameterpencarian . '%');
        }
        $jumlahdata = $query->count();
        $result = $query->take($perHalaman)
            ->skip($offset)
            ->orderBy('siswa_tagihan.nis', 'ASC')
            ->get();
        return [
            'data' => $result,
            'total' => $jumlahdata
        ];
    }
}
