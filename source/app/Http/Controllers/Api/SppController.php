<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Tagihan, Transaksi, TransaksiDetail, TagihanNonBulanan};
use App\Helpers\ResponseHelper;
use Illuminate\Support\Facades\Validator;
use App\Services\TransaksiServices;
use Illuminate\Support\Facades\Log;

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
    public function gettagihan_non_bulanan(Request $request){
        try {
            $perHalaman = (int) $request->length > 0 ? (int) $request->length : 1;
            $nomorHalaman = (int) $request->start / $perHalaman;
            $offset = $nomorHalaman * $perHalaman;
            $data = TagihanNonBulanan::listTagihanTabel($request, $perHalaman, $offset);
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
                'metode_bayar' => 'required|string',
                'nominal_bayar_konfirmasi' => 'required|integer',
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
    public function detailtransaksiid(Request $req) {
        try {
            $data = TransaksiDetail::getDetailTransaksi($req->id_transaksi);
            $dynamicAttributes = [  
                'data' => $data,
            ];
            return ResponseHelper::data(__('common.data_ready', ['namadata' => 'Informasi Pembayaran Siswa SMK PGRI 6 Malang']), $dynamicAttributes);
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function simpantagihan(Request $req) {
        try {
            if (empty($req->rowsData)) {
                return ResponseHelper::error("Data tidak boleh kosong");
            }
            $totaldatainsert = Tagihan::simpanTagihan($req);
            return ResponseHelper::success("Data tagihan siswa sejumlah ".$totaldatainsert." Data berhasil ditambahkan");
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function simpantagihan_non_bulanan(Request $req) {
        try {
            if (empty($req->rowsData)) {
                return ResponseHelper::error("Data tidak boleh kosong");
            }
            $totaldatainsert = TagihanNonBulanan::simpanTagihanNonBulanan($req);
            return ResponseHelper::success("Data tagihan siswa sejumlah ".$totaldatainsert." Data berhasil ditambahkan");
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function editdaftartagihan(Request $req) {
        try {
            $data = Tagihan::join('siswa_buku_induk', 'siswa_buku_induk.id', '=', 'siswa_tagihan.nis')
            ->where('siswa_buku_induk.id', $req->id_siswa)->first();
            $dynamicAttributes = [
                'data' => $data,
            ];
            return ResponseHelper::data(__('common.data_ready', ['namadata' => 'Informasi detail tagihan Siswa SMK PGRI 6 Malang']), $dynamicAttributes);
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }   
    public function editdaftartagihan_non_bulanan(Request $req){
        try {
            $data = TagihanNonBulanan::join('siswa_buku_induk', 'siswa_buku_induk.id', '=', 'siswa_tagihan_dinamis.id_siswa')
            ->where('siswa_buku_induk.id', $req->id_siswa)
            ->where('kode_jenis_transaksi', $req->kode_jenis_transaksi)
            ->where('siswa_tagihan_dinamis.id_tahun_ajaran', $req->id_tahun_ajaran)
            ->first();
            $dynamicAttributes = [
                'data' => $data,
            ];
            return ResponseHelper::data(__('common.data_ready', ['namadata' => 'Informasi detail tagihan non bulanan Siswa SMK PGRI 6 Malang']), $dynamicAttributes);
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function updatetagihan(Request $req) {
        try {
           Tagihan::where('nis', $req->id_siswa)->update([
                'total_tagihan_juli' => $req->tagihan_juli,
                'total_tagihan_agustus' => $req->tagihan_agustus,
                'total_tagihan_september' => $req->tagihan_september,
                'total_tagihan_oktober' => $req->tagihan_oktober,
                'total_tagihan_november' => $req->tagihan_november,
                'total_tagihan_desember' => $req->tagihan_desember,
                'total_tagihan_januari' => $req->tagihan_januari,
                'total_tagihan_februari' => $req->tagihan_februari,
                'total_tagihan_maret' => $req->tagihan_maret,
                'total_tagihan_april' => $req->tagihan_april,
                'total_tagihan_mei' => $req->tagihan_mei,
                'total_tagihan_juni' => $req->tagihan_juni,
                'juli' => $req->juli,
                'agustus' => $req->agustus,
                'september' => $req->september,
                'oktober' => $req->oktober,
                'november' => $req->november,
                'desember' => $req->desember,
                'januari' => $req->januari,
                'februari' => $req->februari,
                'maret' => $req->maret,
                'april' => $req->april,
                'mei' => $req->mei,
                'juni' => $req->juni,
            ]);
            return ResponseHelper::success("Data tagihan siswa berhasil diperbarui");
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function updatetagihan_non_bulanan(Request $req) {
        Log::info($req->input());
        try {
            TagihanNonBulanan::where('id_siswa', $req->input('id_siswa'))
            ->where('kode_jenis_transaksi', $req->input('kode_jenis_transaksi'))
            ->where('id_tahun_ajaran', $req->input('id_tahun_ajaran'))
            ->update([
                'qty' => $req->input('qty'),
                'sisa_nominal' => $req->input('sisa_nominal'),
                'nominal' => $req->input('nominal'),
            ]);
            return ResponseHelper::success("Data tagihan siswa berhasil diperbarui");
        }catch(\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
}
