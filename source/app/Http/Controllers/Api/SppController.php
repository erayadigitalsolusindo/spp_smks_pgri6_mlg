<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tagihan;
use App\Helpers\ResponseHelper;

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
}
