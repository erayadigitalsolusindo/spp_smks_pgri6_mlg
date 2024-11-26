<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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
        if (!empty($request->parameter_pencarian)) {
            $query->where(function($subQuery) use ($request) {
                $subQuery->where('transaksi.no_transaksi', 'LIKE', '%' . $request->parameter_pencarian . '%')
                        ->orWhere('siswa_buku_induk.nama_siswa', 'LIKE', '%' . $request->parameter_pencarian . '%')
                        ->orWhere('transaksi.no_transaksi_transfer', 'LIKE', '%' . $request->parameter_pencarian . '%')
                        ->orWhere('transaksi.nis', 'LIKE', '%' . $request->parameter_pencarian . '%');
            });
        }
        $query->whereBetween(DB::raw('DATE('.$prefix.'transaksi.tanggal)'), [$request->tanggal_awal, $request->tanggal_akhir]);
        $jumlahdata = $query->count();
        $result = $query->orderBy('transaksi.tanggal', 'DESC')
            ->offset($offset)
            ->limit($perHalaman)
            ->get();

        return [
            'data' => $result,
            'total' => $jumlahdata,
        ];

    }
    public static function pdf_laporan_pembayaran($request){
        $tanggal = $request->input('tanggal');
        if (strpos($tanggal, 'sampai') !== false) {
            $dates = explode(' sampai ', $tanggal);
            $startDate = Carbon::createFromFormat('d-m-Y', $dates[0])->format('Y-m-d');
            $endDate = Carbon::createFromFormat('d-m-Y', $dates[1])->format('Y-m-d');
        } else {
            $startDate = $endDate = Carbon::createFromFormat('d-m-Y', $tanggal)->format('Y-m-d');
        }
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
                DB::raw('sum('.$prefix.'transaksi_spp.nominal) as sum_nominal'),
                DB::raw('count(*) as jumlah_trx'),
                DB::raw('DATE_FORMAT('.$prefix.'transaksi.tanggal, "%d-%m-%Y %H:%i:%s") as tanggal_transaksi')
            )
            ->groupBy(
                'transaksi.nis',
                DB::raw('DATE('.$prefix.'transaksi.tanggal)')
            );
        if (!empty($request->parameter_pencarian)) {
            $query->where(function($subQuery) use ($request) {
                $subQuery->where('transaksi.no_transaksi', 'LIKE', '%' . $request->input('parameter_pencarian') . '%')
                        ->orWhere('siswa_buku_induk.nama_siswa', 'LIKE', '%' . $request->input('parameter_pencarian') . '%')
                        ->orWhere('transaksi.no_transaksi_transfer', 'LIKE', '%' . $request->input('parameter_pencarian') . '%')
                        ->orWhere('transaksi.nis', 'LIKE', '%' . $request->input('parameter_pencarian') . '%');
            });
        }
        $query->whereBetween(DB::raw('DATE('.$prefix.'transaksi.tanggal)'), [$startDate, $endDate]);
        $jumlahdata = $query->count();
        $result = $query->orderBy('transaksi.tanggal', 'DESC')->get();
        return [
            'data' => $result,
            'total' => $jumlahdata,
            'tanggal_awal' => $startDate,
            'tanggal_akhir' => $endDate,
        ];
    }
}
