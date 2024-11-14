<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Siswa, JenisPembayaran, Kelas};
use App\Helpers\ResponseHelper;

class MasterDataController extends Controller
{
    public function getsiswa(Request $req){
        try {
            $perHalaman = (int) $req->length > 0 ? (int) $req->length : 1;
            $nomorHalaman = (int) $req->start / $perHalaman;
            $offset = $nomorHalaman * $perHalaman;
            $data = Siswa::getSiswa($req, $perHalaman, $offset);
            $jumlahdata = $data['total'];
            $dynamicAttributes = [
                'data' => $data['data'],
                'recordsFiltered' => $jumlahdata,
            ];
            return ResponseHelper::data(__('common.data_ready', ['namadata' => 'Daftar Member MCU']), $dynamicAttributes);
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function getjenispembayaran(Request $req){
        try {
            $data = JenisPembayaran::where('jenis_transaksi', 'LIKE', '%' . $req->parameter_pencarian . '%');
            $data = $data->get();
            $dynamicAttributes = [
                'data' => $data,
            ];
            return ResponseHelper::data(__('common.data_ready', ['namadata' => 'Daftar Jenis Pembayaran']), $dynamicAttributes);
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function getkelas(Request $req){
        try {
            $data = Kelas::where('tingkat_kelas', 'LIKE', '%' . $req->parameter_pencarian . '%');
            $data = $data->get();
            $dynamicAttributes = [
                'data' => $data,
            ];
            return ResponseHelper::data(__('common.data_ready', ['namadata' => 'Daftar Kelas']), $dynamicAttributes);
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function tambahkeranjangtagihan(Request $req){
        try {
            $data = Siswa::join('siswa_tahun_ajaran', 'siswa_tahun_ajaran.id_tahun_ajaran', '=', 'siswa_buku_induk.id_tahun_ajaran')
                        ->where('siswa_buku_induk.id_kelas', $req->id_kelas)
                        ->get();
            $dynamicAttributes = [
                'data' => $data,
            ];
            return ResponseHelper::data(__('common.data_ready', ['namadata' => 'Informasi siswa yang akan diberikan tagihan']), $dynamicAttributes);
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function hapustagihanpeserta(Request $req){
        try {
            Siswa::where('id', $req->idpeserta)->delete();
            return ResponseHelper::success_delete('Informasi siswa '.$req->nama_peserta.' dengan ID '.$req->idpeserta.' berhasil dihapus. Jikalau ingin melihat data atas siswa ini hubungi Teknisi');
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
}
