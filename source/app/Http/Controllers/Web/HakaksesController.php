<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HakaksesController extends Controller
{
    private function getData($req, $title, $breadcrumb) {
        return [
            'title' => $title,
            'breadcrumb' => $breadcrumb,
            'user_details' => $req->attributes->get('user_details'),
        ];
    }
    public function pengguna_aplikasi(Request $req){
        $data = $this->getData($req, 'Daftar Pengguna Aplikasi', [
            'Pengguna Aplikasi' => route('admin.pengguna_aplikasi'),
        ]);
        return view('paneladmin.pengaturan.pengguna.daftar_penggunaaplikasi', ['data' => $data]);
    }
    public function permission(Request $req){
        $data = $this->getData($req, 'Daftar Hak Akses', [
            'Role' => route('admin.role'),
            'Permission' => route('admin.permission'),
        ]);
        return view('paneladmin.pengaturan.roledanhakakses.daftar_permission', ['data' => $data]);
    }
    public function role(Request $req){
        $data = $this->getData($req, 'Daftar Role', [
            'Role' => route('admin.role'),
            'Permission' => route('admin.permission'),
        ]);
        return view('paneladmin.pengaturan.roledanhakakses.daftar_role', ['data' => $data]);
    }
}
