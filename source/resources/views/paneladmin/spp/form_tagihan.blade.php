@extends('paneladmin.templateadmin')
@section('konten_utama_admin')
<div class="row">
    <div class="col-sm-12">
    <div class="card">
        <div class="card-header">
          <h4>Formulir Tagihan</h4><span>Isikan formulir dari data tagihan siswa yang belum terdaftar pada daftar tagihan. Tentukan tagihan pada tiap bulan masing masing dari siswa yang terdaftar pada buku induk siswa SMKS PGRI 6 Malang. Sistem akan melakukan prioritas terhadap pemilihan berdasarkan kelas</span>
        </div>
        <div class="card-body">
          <div class="col-md-12">
            <select class="form-control" id="select_siswa_transaksi_spp"></select>
            <div class="main-divider" style="margin-top: -15px;">
              <div class="main-divider divider-body divider-body-1 divider-primary"> 
                <div class="divider-p-primary"><i class="fa fa-modx me-2 txt-primary f-20"></i><span class="txt-primary">Atau Masukkan Berdasarkan</span></div>
              </div>
            </div>
            <select class="form-control" id="daftar_kelas_form_tagihan"></select>
            <div class="row mb-3">
              <div class="col-md-6">
                <input type="text" class="form-control" id="nominal_tagihan" placeholder="Tentukan Nominal">
              </div>
              <div class="col-md-6">
                <select class="form-control" id="bulan_tagihan_form_tagihan">
                  <option value="Semua Bulan">Semua Bulan</option>
                  <option value="Januari">Januari</option>
                  <option value="Februari">Februari</option>
                  <option value="Maret">Maret</option>
                  <option value="April">April</option>
                  <option value="Mei">Mei</option>
                  <option value="Juni">Juni</option>
                  <option value="Juli">Juli</option>
                  <option value="Agustus">Agustus</option>
                  <option value="September">September</option>
                  <option value="Oktober">Oktober</option>
                  <option value="November">November</option>
                  <option value="Desember">Desember</option>
                </select>
              </div>
            </div>
          </div>
          <button class="btn btn-primary w-100" onclick="tentukan_tagihan()" id="simpan_tagihan_form_tagihan">Tentukan Tagihan</button>
        </div>
      </div>
    </div>
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header">
          <h4>Daftar Konfirmasi Tagihan Siswa</h4>
          <button class="btn btn-success mt-2 w-100" onclick="simpan_tagihan()">Simpan Tagihan</button>
        </div>
        <div class="card-body">
          <div class="table">
            <input type="text" class="form-control" id="cari_siswa_form_tagihan" placeholder="Cari siswa berdasarkan nama dan NIS">
            <table class="display" id="datatables_form_tagihan">
              <thead>
                <tr>
                    <th>ID</th>
                    <th>NIS</th>
                    <th>Nama</th>
                    <th>Tahun Ajaran</th>
                    <th>Tentukan Tagihan Juli</th>
                    <th>Tentukan Tagihan Agustus</th>
                    <th>Tentukan Tagihan September</th>
                    <th>Tentukan Tagihan Oktober</th>
                    <th>Tentukan Tagihan November</th>
                    <th>Tentukan Tagihan Desember</th>
                    <th>Tentukan Tagihan Januari</th>
                    <th>Tentukan Tagihan Februari</th>
                    <th>Tentukan Tagihan Maret</th>
                    <th>Tentukan Tagihan April</th>
                    <th>Tentukan Tagihan Mei</th>
                    <th>Tentukan Tagihan Juni</th>
                </tr>
            </thead>
            <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
</div>
@endsection
@section('css_load')
@component('komponen.css.datatables')
@endcomponent
<link href="https://cdn.datatables.net/keytable/2.12.1/css/keyTable.bootstrap5.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<style>
.select2-container--default .select2-selection--single .select2-selection__arrow {
    margin-top: 10px;
    margin-right: 10px;
}
.select2-container--open .select2-dropdown--below {
    margin-top: -20px;
    border-top-left-radius:2;
    border-top-right-radius:2;
}
</style>
@endsection
@section('js_load')
@component('komponen.js.datatables')
@endcomponent
<script src="https://cdn.datatables.net/keytable/2.12.1/js/dataTables.keyTable.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/autonumeric/4.8.1/autoNumeric.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="{{asset('mofi/assets/js/system/globalfn.js')}}"></script>
<script src="{{asset('mofi/assets/js/system/transaksi/form_tagihan.js')}}"></script>
@endsection
