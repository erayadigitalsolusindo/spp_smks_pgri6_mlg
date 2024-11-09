<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
}
