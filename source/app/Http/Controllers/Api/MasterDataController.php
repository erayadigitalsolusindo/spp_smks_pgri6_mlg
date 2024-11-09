<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Siswa, JenisPembayaran};
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
}
