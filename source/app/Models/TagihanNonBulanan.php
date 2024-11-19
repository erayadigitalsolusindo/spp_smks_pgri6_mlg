<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class TagihanNonBulanan extends Model
{
    protected $table = 'siswa_tagihan_dinamis';
    protected $fillable = [
        'id_siswa',
        'kode_jenis_transaksi',
        'qty', 
        'nominal', 
        'id_tahun_ajaran'
    ];
    public $timestamps = false;
    public static function listTagihanTabel($req, $perHalaman, $offset)
    {
        $parameterpencarian = $req->parameter_pencarian;
        $kelas_terpilih = $req->kelas_terpilih;
        $tahun_ajaran_terpilih = $req->tahun_ajaran_terpilih;
        $query = DB::table((new self())->getTable())
        ->join('siswa_buku_induk', 'siswa_buku_induk.id', '=', 'siswa_tagihan_dinamis.id_siswa')
        ->join('transaksi_jenis_trx', 'transaksi_jenis_trx.kode', '=', 'siswa_tagihan_dinamis.kode_jenis_transaksi')
        ->join('atr_kelas', 'atr_kelas.id', '=', 'siswa_buku_induk.id_kelas')
        ->select('transaksi_jenis_trx.*','siswa_buku_induk.id as id_siswa', 'siswa_tagihan_dinamis.*', 'siswa_buku_induk.nis', 'siswa_buku_induk.nama_siswa', 'atr_kelas.tingkat_kelas');
        if (!empty($kelas_terpilih)) {
            $query->where('atr_kelas.id', $kelas_terpilih);
        }else{
            $query->where(function($q) use ($parameterpencarian) {
                $q->where('siswa_buku_induk.nis', 'LIKE', '%' . $parameterpencarian . '%')
                  ->orWhere('siswa_buku_induk.nama_siswa', 'LIKE', '%' . $parameterpencarian . '%');
            })->where('siswa_tagihan_dinamis.id_tahun_ajaran','LIKE','%' . $tahun_ajaran_terpilih. '%');
        }
        $jumlahdata = $query->count();
        $result = $query->take($perHalaman)
            ->skip($offset)
            ->orderBy('siswa_buku_induk.nis', 'ASC')
            ->get();
        return [
            'data' => $result,
            'total' => $jumlahdata
        ];
    }
}
