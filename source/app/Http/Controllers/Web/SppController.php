<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SppController extends Controller
{
    private function getData($req, $title, $breadcrumb) {
        return [
            'title' => $title,
            'breadcrumb' => $breadcrumb,
            'user_details' => $req->attributes->get('user_details'),
        ];
    }
    public function transaksi_pembayaran(Request $req)
    {
        $data = $this->getData($req, 'Transaksi Pembayaran', [
            'Beranda' => route('admin.beranda'),
            'Transaksi Pembayaran' => route('spp.transaksi_pembayaran'),
        ]);
        return view('paneladmin.spp.transaksi_pembayaran', ['data' => $data]);
    }
    public function daftar_tagihan(Request $req)
    {
        $data = $this->getData($req, 'Daftar Tagihan', [
            'Beranda' => route('admin.beranda'),
            'Daftar Tagihan' => route('spp.daftar_tagihan'),
        ]);
        return view('paneladmin.spp.daftar_tagihan', ['data' => $data]);
    }   
}
