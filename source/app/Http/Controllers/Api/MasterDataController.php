<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Siswa, JenisPembayaran, Kelas, JenisTransaksi, TagihanNonBulanan};
use App\Helpers\ResponseHelper;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

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
    public function getjenispembayarantabel(Request $req){
        try {
            $perHalaman = (int) $req->length > 0 ? (int) $req->length : 1;
            $nomorHalaman = (int) $req->start / $perHalaman;
            $offset = $nomorHalaman * $perHalaman; 
            $datatabel = JenisPembayaran::getjenispembayarantabel($req, $perHalaman, $offset);
            $jumlahdata = $datatabel['total'];
            $dynamicAttributes = [
                'data' => $datatabel['data'],
                'recordsFiltered' => $jumlahdata,
                'pages' => [
                    'limit' => $perHalaman,
                    'offset' => $offset,
                ],
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
            $data = Siswa::join('siswa_tahun_ajaran', 'siswa_tahun_ajaran.id_tahun_ajaran', '=', 'siswa_buku_induk.id_tahun_ajaran');
            if ($req->input('id_siswa') != null) {
                $data = $data->where('siswa_buku_induk.id', $req->input('id_siswa'));
            } else {
                $data = $data->where('siswa_buku_induk.id_kelas', $req->input('id_kelas'));
            }
            $data = $data->orderBy('siswa_buku_induk.nama_siswa', 'ASC')->get();
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
    public function hapustagihanpeserta_non_bulanan(Request $req){
        try {
            TagihanNonBulanan::where('id_siswa', $req->id_siswa)->delete();
            return ResponseHelper::success_delete('Informasi siswa '.$req->nama_siswa.' dengan ID '.$req->id_siswa.' berhasil dihapus. Jikalau ingin melihat data atas siswa ini hubungi Teknisi');
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function simpaninformasisiswa(Request $req){
        try {
            $validator = Validator::make($req->all(), [
                'nis' => 'required',
                'nama_siswa' => 'required',
                'kelas' => 'required',
                'tahun_ajaran' => 'required',
                'jenis_kelamin' => 'required',
            ]);
            if ($validator->fails()) {
                $dynamicAttributes = ['errors' => $validator->errors()];
                return ResponseHelper::error_validation(__('auth.eds_required_data'), $dynamicAttributes);
            }
            $data = [
                'id_kelas' => $req->kelas,
                'nisn' => $req->nisn,
                'nama_siswa' => $req->nama_siswa,
                'alamat_siswa' => $req->alamat_siswa,
                'no_telepon' => $req->no_telepon,
                'email' => $req->email,
                'jenis_kelamin' => $req->jenis_kelamin,
                'id_tahun_ajaran' => $req->tahun_ajaran,
            ];
            if (filter_var($req->isedit, FILTER_VALIDATE_BOOLEAN)) {
                Siswa::where('id', $req->id)->update($data);
            }else{
                Siswa::updateOrCreate(
                    ['nis' => $req->nis],
                    $data
                );
            }
            return ResponseHelper::success('Informasi siswa berhasil disimpan');
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function hapusinformasisiswa(Request $req){
        try {
            $validator = Validator::make($req->all(), [
                'id' => 'required',
            ]);
            if ($validator->fails()) {
                $dynamicAttributes = ['errors' => $validator->errors()];
                return ResponseHelper::error_validation(__('auth.eds_required_data'), $dynamicAttributes);
            }
            Siswa::where('id', $req->id)->delete();
            return ResponseHelper::success_delete('Informasi siswa '.$req->nama_siswa.' dengan NIS '.$req->nis.' berhasil dihapus. Semua informasi mengenai transaksi in tidak dihapus, hanya saja tidak bisa ditampilkan secara visual');
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function getinformasisiswa(Request $req){
        try {
            $data = Siswa::getSiswaWhereId($req->id);
            $dynamicAttributes = [
                'data' => $data,
            ];
            return ResponseHelper::data('Informasi siswa dengan ID '.$req->id, $dynamicAttributes);
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function tambahjenispembayaran(Request $req){
        try {
            $validator = Validator::make($req->all(), [
                'kode' => 'required',
                'jenis_transaksi' => 'required',
            ]);
            if ($validator->fails()) {
                $dynamicAttributes = ['errors' => $validator->errors()];
                return ResponseHelper::error_validation(__('auth.eds_required_data'), $dynamicAttributes);
            }
            $data = [
                'kode' => $req->input('kode'),
                'jenis_transaksi' => $req->input('jenis_transaksi'),
            ];
            JenisTransaksi::updateOrCreate(
                ['kode' => $req->input('kode')],
                $data
            );
            return ResponseHelper::data('Jenis pembayaran berhasil disimpan');
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function hapusjenispembayaran(Request $req){
        try {
            JenisTransaksi::where('kode', $req->kode_jenis_transaksi)->delete();
            return ResponseHelper::success_delete('Jenis pembayaran berhasil dihapus');
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
}
