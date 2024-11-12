<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Tagihan, Transaksi, TransaksiDetail};
use App\Helpers\ResponseHelper;
use Illuminate\Support\Facades\Validator;
use App\Services\TransaksiServices;

class SppController extends Controller
{
    public function gettagihan(Request $request) {
        try {
            $perHalaman = (int) $request->length > 0 ? (int) $request->length : 1;
            $nomorHalaman = (int) $request->start / $perHalaman;
            $offset = $nomorHalaman * $perHalaman;
            $data = Tagihan::listTagihanTabel($request, $perHalaman, $offset);
            $jumlahdata = $data['total'];
            $dynamicAttributes = [
                'data' => $data['data'],
                'recordsFiltered' => $jumlahdata,
                'pages' => [
                    'limit' => $perHalaman,
                    'offset' => $offset,
                ],
            ];
            return ResponseHelper::data(__('common.data_ready', ['namadata' => 'Informasi Tagihan Siswa SMK PGRI 6 Malang']), $dynamicAttributes);
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function transaksispp(TransaksiServices $transaksiServices, Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                'totalbaris' => 'required|integer',
                'id_siswa' => 'required|string',
                'nominal_bayar' => 'required|array',
                'kodebulan' => 'required|array',
                'petugas_id' => 'required|integer',
                'tahun_ajaran' => 'required|string',
            ]);
            if ($validator->fails()) {
                $dynamicAttributes = ['errors' => $validator->errors()];
                return ResponseHelper::error_validation(__('auth.eds_required_data'), $dynamicAttributes);
            }
            $hasildatainsert = $transaksiServices->handleTransactionTransaksiSiswa($request);
            return ResponseHelper::success("Informasi Transaksi SPP Siswa SMK PGRI 6 Malang dengan NIS " . $request->nama_siswa . " berhasil ditransaksi dan dicatat di dalam database");

        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function getpembayaran(Request $req) {
        try {
            $perHalaman = (int) $req->length > 0 ? (int) $req->length : 1;
            $nomorHalaman = (int) $req->start / $perHalaman;
            $offset = $nomorHalaman * $perHalaman;
            $data = TransaksiDetail::listTransaksiTabel($req, $perHalaman, $offset);
            $jumlahdata = $data['total'];
            $dynamicAttributes = [
                'data' => $data['data'],
                'recordsFiltered' => $jumlahdata,
            ];
            return ResponseHelper::data(__('common.data_ready', ['namadata' => 'Informasi Pembayaran Siswa SMK PGRI 6 Malang']), $dynamicAttributes);
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function detailtransaksi(Request $req) {
        try {
            $data = TransaksiDetail::where('id', $req->id_transaksi)->orWhere('keterangan', 'LIKE', '%' . $req->parameter_pencarian . '%')->get();
            $dynamicAttributes = [
                'data' => $data,
            ];
            return ResponseHelper::data(__('common.data_ready', ['namadata' => 'Informasi Pembayaran Siswa SMK PGRI 6 Malang']), $dynamicAttributes);
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function hapuspembayaran(TransaksiServices $transaksiServices, Request $req) {
        try {
            $data = $req->all();    
            $transaksiServices->handleTransactionHapusTransaksi($data);
            return ResponseHelper::success("Data pembayaran siswa SMK PGRI 6 Malang dengan No. Transaksi " . $req->no_transaksi . " berhasil dihapus serta tagihan siswa akan ditambahkan kembali sesuai dengan nominal pembayaran awal");
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
}
