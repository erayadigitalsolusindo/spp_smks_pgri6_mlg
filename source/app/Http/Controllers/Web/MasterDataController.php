<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Kelas, TahunAjaran};

class MasterDataController extends Controller
{
    private function getData($req, $title, $breadcrumb) {
        return [
            'title' => $title,
            'breadcrumb' => $breadcrumb,
            'user_details' => $req->attributes->get('user_details'),
        ];
    }
    public function daftar_kelas_siswa(Request $req)
    {
        $data = $this->getData($req, 'Daftar Kelas Siswa', [
            'Beranda' => route('admin.beranda'),
            'Kelas Siswa' => route('admin.daftar_kelas_siswa'),
        ]);
        return view('paneladmin.master_data.kelas_siswa', ['data' => $data]);
    }
    public function mini_buku_induk(Request $req)
    {
        $data = $this->getData($req, 'Mini Buku Induk', [
            'Beranda' => route('admin.beranda'),
            'Mini Buku Induk' => route('admin.mini_buku_induk'),
        ]);
        $data['informasi_kelas'] = Kelas::all();
        $data['informasi_tahun_ajaran'] = TahunAjaran::all();
        return view('paneladmin.master_data.mini_buku_induk', ['data' => $data]);
    }
}
