<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
class TransaksiDetail extends Model
{
    protected $table = 'transaksi_spp';
    protected $fillable = [
        'id_transaksi',
        'nominal',
        'kode_bulan',
        'tahun_ajaran',
        'kode_jenis_transaksi',
        'keterangan'
    ];
    public static function listTransaksiTabel($req, $perHalaman, $offset) {
        $parameterpencarian = $req->parameter_pencarian;
        $tablePrefix = config('database.connections.mysql.prefix');
        $query = DB::table((new self())->getTable())
            ->join('transaksi', 'transaksi.id', '=', 'transaksi_spp.id_transaksi')
            ->join('siswa_buku_induk', 'siswa_buku_induk.id', '=', 'transaksi.nis')
            ->join('users_pegawai', 'users_pegawai.id', '=', 'transaksi.petugas')
            ->join('atr_kelas', 'atr_kelas.id', '=', 'siswa_buku_induk.id_kelas')
            ->select('transaksi.id as id_transaksi','transaksi_spp.*','transaksi.no_transaksi as no_transaksi','siswa_buku_induk.*','siswa_buku_induk.nis as nis_siswa','users_pegawai.*','atr_kelas.*', DB::raw('SUM(nominal) as total_nominal'), DB::raw('DATE_FORMAT(tanggal, "%d-%m-%Y %H:%i:%s") as tanggal_transaksi'), DB::raw('COUNT(no_transaksi) as total_trx'));
        if (!empty($parameterpencarian)) {
            $query->where('no_transaksi', 'LIKE', '%' . $parameterpencarian . '%')
                  ->orWhere('nama_siswa', 'LIKE', '%' . $parameterpencarian . '%');
        }
        $result = $query->take($perHalaman)
            ->skip($offset)
            ->orderBy('tanggal', 'DESC')
            ->groupBy('no_transaksi')
            ->get();
        $jumlahdata = $query->count();
        return [
            'data' => $result,
            'total' => $jumlahdata
        ];
    }
    public static function getDetailTransaksi($id_transaksi) {
        $tablePrefix = config('database.connections.mysql.prefix');
        $query = DB::table((new self())->getTable())
            ->join('transaksi', 'transaksi.id', '=', 'transaksi_spp.id_transaksi')
            ->join('transaksi_jenis_trx', 'transaksi_jenis_trx.kode', '=', 'transaksi_spp.kode_jenis_transaksi')
            ->join('siswa_buku_induk', 'siswa_buku_induk.id', '=', 'transaksi.nis')
            ->join('users_pegawai', 'users_pegawai.id', '=', 'transaksi.petugas')
            ->join('atr_kelas', 'atr_kelas.id', '=', 'siswa_buku_induk.id_kelas')
            ->join('siswa_tahun_ajaran', 'siswa_tahun_ajaran.id_tahun_ajaran', '=', 'transaksi.tahun_ajaran')
            ->select('siswa_tahun_ajaran.id_tahun_ajaran as id_tahun_ajaran','siswa_buku_induk.id as id_siswa','transaksi.*','siswa_tahun_ajaran.tahun_ajaran as tahun_ajaran','transaksi.id as id_transaksi','transaksi_spp.*','transaksi.no_transaksi as no_transaksi','siswa_buku_induk.*','siswa_buku_induk.nis as nis_siswa','users_pegawai.*','atr_kelas.*','transaksi_jenis_trx.jenis_transaksi', DB::raw('DATE_FORMAT(tanggal, "%d-%m-%Y %H:%i:%s") as tanggal_transaksi'));
        $query->where('transaksi.id', $id_transaksi);   
        return $query->get();
    }
}
