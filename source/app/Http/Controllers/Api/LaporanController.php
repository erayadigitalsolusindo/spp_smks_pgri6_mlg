<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Laporan;
use App\Helpers\ResponseHelper;

class LaporanController extends Controller
{
    public function laporanpembayaran(Request $req){
        try {
            $perHalaman = (int) $req->length > 0 ? (int) $req->length : 1;
            $nomorHalaman = (int) $req->start / $perHalaman;
            $offset = $nomorHalaman * $perHalaman; 
            $datatabel = Laporan::laporan_pembayaran($req, $perHalaman, $offset);
            $jumlahdata = $datatabel['total'];
            $dynamicAttributes = [
                'data' => $datatabel['data'],
                'recordsFiltered' => $jumlahdata,
                'pages' => [
                    'limit' => $perHalaman,
                    'offset' => $offset,
                ],
            ];
            return ResponseHelper::data(__('common.data_ready', ['namadata' => 'Laporan Pembayaran']), $dynamicAttributes);
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
}
