<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{TransaksiDetail, Transaksi};
use PDF;

class SppController extends Controller
{
    private function getData($req, $title, $breadcrumb) {
        return [
            'title' => $title,
            'breadcrumb' => $breadcrumb,
            'user_details' => $req->attributes->get('user_details'),
        ];
    }
    public function transaksi_pembayaran(Request $req, $id_transaksi = null)
    {
        $data = $this->getData($req, 'Transaksi Pembayaran', [
            'Beranda' => route('admin.beranda'),
            'Transaksi Pembayaran' => route('spp.transaksi_pembayaran'),
        ]);
        if ($id_transaksi != null) {
            $data['id_transaksi'] = $id_transaksi;
        }
        return view('paneladmin.spp.transaksi_pembayaran', ['data' => $data]);
    }
    public function daftar_pembayaran(Request $req)
    {
        $data = $this->getData($req, 'Daftar Pembayaran', [
            'Beranda' => route('admin.beranda'),
            'Daftar Pembayaran' => route('spp.daftar_pembayaran'),
        ]);
        return view('paneladmin.spp.daftar_pembayaran', ['data' => $data]);
    }
    public function daftar_tagihan(Request $req)
    {
        $data = $this->getData($req, 'Daftar Tagihan', [
            'Beranda' => route('admin.beranda'),
            'Daftar Tagihan' => route('spp.daftar_tagihan'),
        ]);
        return view('paneladmin.spp.daftar_tagihan', ['data' => $data]);
    }
    public function form_tagihan(Request $req)
    {
        $data = $this->getData($req, 'Formulir Tagihan', [
            'Beranda' => route('admin.beranda'),
            'Tambah Tagihan' => route('spp.form_tagihan'),
        ]);
        return view('paneladmin.spp.form_tagihan', ['data' => $data]);
    }   
    public function cetakbuktipembayaran(Request $req, $id_transaksi) {
        $informasi_transaksi = Transaksi::join('siswa_buku_induk','siswa_buku_induk.id','=','transaksi.nis')
        ->join('transaksi_spp','transaksi_spp.id_transaksi','=','transaksi.id')
        ->join('atr_kelas','atr_kelas.id','=','siswa_buku_induk.id_kelas')
        ->join('transaksi_jenis_trx','transaksi_jenis_trx.kode','=','transaksi_spp.kode_jenis_transaksi')
        ->join('users','users.id','=','transaksi.petugas')
        ->join('users_pegawai','users_pegawai.id','=','users.id')
        ->where('transaksi.id', $id_transaksi)->get();
        $data = [
            'title' => 'Cetak Bukti Pembayaran',
            'date' => date('d-m-Y'),
            'breadcrumb' => [
                'Beranda' => route('admin.beranda'),
                'Cetak Bukti Pembayaran' => route('spp.cetak_bukti_pembayaran', ['id_transaksi' => $id_transaksi]),
            ],
            'informasi_transaksi' => $informasi_transaksi,
        ];
        return PDF::loadView('paneladmin.nota.cetak_bukti_pembayaran', ['data' => $data])
        ->setPaper('a4', 'portrait')
        ->setOptions(['isRemoteEnabled' => true])
        ->stream();
    }
}
