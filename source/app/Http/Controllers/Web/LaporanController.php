<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    private function getData($req, $title, $breadcrumb) {
        return [
            'title' => $title,
            'breadcrumb' => $breadcrumb,
            'user_details' => $req->attributes->get('user_details'),
        ];
    }
    function laporan_pembayaran(Request $req){
        $data = $this->getData($req, 'Laporan Pembayaran', [
            'Beranda' => route('admin.beranda'),
            'Laporan Pembayaran' => route('laporan.laporan_pembayaran'),
        ]);
        return view('paneladmin.laporan.laporan_pembayaran', ['data' => $data]);
    }
}
