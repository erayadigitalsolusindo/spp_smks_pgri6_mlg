<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Laporan extends Model
{
    public static function laporan_pembayaran($request, $perHalaman, $offset){
        $prefix = DB::getTablePrefix();
        $query = DB::table('transaksi')
            ->join('transaksi_spp', 'transaksi_spp.id_transaksi', '=', 'transaksi.id')
            ->join('siswa_tahun_ajaran', 'siswa_tahun_ajaran.id_tahun_ajaran', '=', 'transaksi.tahun_ajaran')
            ->join('siswa_buku_induk', 'siswa_buku_induk.id', '=', 'transaksi.nis')
            ->join('users_pegawai', 'users_pegawai.id', '=', 'transaksi.petugas')
            ->join('atr_kelas', 'atr_kelas.id', '=', 'siswa_buku_induk.id_kelas')
            ->join('transaksi_jenis_trx', 'transaksi_jenis_trx.kode', '=', 'transaksi_spp.kode_jenis_transaksi')
            ->select(
                'siswa_tahun_ajaran.id_tahun_ajaran as id_tahun_ajaran',
                'siswa_buku_induk.id as id_siswa',
                'transaksi.*',
                'siswa_tahun_ajaran.tahun_ajaran as tahun_ajaran',
                'transaksi.id as id_transaksi',
                'transaksi_spp.*',
                'transaksi.no_transaksi as no_transaksi',
                'siswa_buku_induk.*',
                'siswa_buku_induk.nis as nis_siswa',
                'users_pegawai.*',
                'atr_kelas.*',
                'transaksi_jenis_trx.jenis_transaksi',
                DB::raw('count(*) as jumlah_trx'),
                DB::raw('DATE_FORMAT('.$prefix.'transaksi.tanggal, "%d-%m-%Y %H:%i:%s") as tanggal_transaksi')
            )
            ->groupBy('transaksi.no_transaksi');
        // Tambahkan Filter Jika Parameter Pencarian Ada
        if (!empty($request->parameter_pencarian)) {
            $query->where(function($subQuery) use ($request) {
                $subQuery->where('transaksi.no_transaksi', 'LIKE', '%' . $request->parameter_pencarian . '%')
                        ->orWhere('transaksi.nama_siswa', 'LIKE', '%' . $request->parameter_pencarian . '%')
                        ->orWhere('transaksi.no_transaksi_transfer', 'LIKE', '%' . $request->parameter_pencarian . '%')
                        ->orWhere('transaksi.nis', 'LIKE', '%' . $request->parameter_pencarian . '%');
            });
        }
        // Filter Berdasarkan Tanggal
        $query->whereBetween(DB::raw('DATE('.$prefix.'transaksi.tanggal)'), [$request->tanggal_awal, $request->tanggal_akhir]);
        // Hitung Total Data
        $jumlahdata = $query->count();
        // Ambil Data dengan Paginasi
        $result = $query->orderBy('transaksi.tanggal', 'DESC')
            ->offset($offset)
            ->limit($perHalaman)
            ->get();

        return [
            'data' => $result,
            'total' => $jumlahdata,
        ];

    }
}
