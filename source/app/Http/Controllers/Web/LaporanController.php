<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PDF;
use App\Models\Laporan;
use Carbon\Carbon;
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
    function pdf_laporan_pembayaran(Request $request){
        $informasi_transaksi = Laporan::pdf_laporan_pembayaran($request);
        $data = [
            'title' => 'Rekap Laporan Pembayaran',
            'date' => date('d-m-Y'),
            'informasi_transaksi' => $informasi_transaksi['data'],
            'total_data' => $informasi_transaksi['total'],
            'tanggal_awal' => Carbon::parse($informasi_transaksi['tanggal_awal'])->translatedFormat('d-m-Y'),
            'tanggal_akhir' => Carbon::parse($informasi_transaksi['tanggal_akhir'])->translatedFormat('d-m-Y'),
        ];
        return PDF::loadView('paneladmin.laporan.pdf_laporan_pembayaran', ['data' => $data])
        ->setPaper('a4', 'portrait')
        ->setOptions(['isRemoteEnabled' => true])
        ->stream();
    }
}
