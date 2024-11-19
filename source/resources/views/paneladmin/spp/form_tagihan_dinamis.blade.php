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
            <div class="row mb-3">
              <div class="col-md-6">
                <input type="text" class="form-control" id="nominal_tagihan" placeholder="Tentukan Nominal">
              </div>
              <div class="col-md-2">
                <input type="text" class="form-control" id="berapa_kali_tagihan" placeholder="Min 1x di tahun ajaran">
              </div>
              <div class="col-md-4">
                <select class="form-control" id="bulan_tagihan_form_tagihan">
                  @foreach ($data['jenis_transaksi'] as $item)
                    <option value="{{$item->kode}}">[{{$item->kode}}] {{$item->jenis_transaksi}} {{$item->jenis == 0 ? '(Bulanan)' : ''}} </option>
                  @endforeach
                </select>
              </div>
            </div>
            <select class="form-control" id="daftar_kelas_form_tagihan"></select>
          </div>
          <strong>Catatan :</strong>
          <ul>
            <li>Tagihan dengan tipe bulanan akan ditagihkan pada tiap bulan masing masing dari siswa yang terdaftar pada buku induk siswa SMKS PGRI 6 Malang.</li>
            <li>Tagihan dengan tipe bulanan akan mengurangi sisa tagihan pada Menu Tagihan Bulanan.</li>
            <li>Untuk tagihan non bulanan tentukan berapa kali dalam 1 tahun ajaran.</li>
            <li>Sistem akan memproses 1 jenis tagihan pada tiap kelas. selain itu akan direfresh ke tabel kosong</li>
          </ul>
          <button class="btn btn-primary w-100" onclick="tentukan_tagihan()" id="simpan_tagihan_form_tagihan">Ubah Qty & Nominal Tagihan</button>
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
                    <th>Jenis Tagihan</th>
                    <th>Perulangan</th>
                    <th>Nominal</th>
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
<script src="https://cdnjs.cloudflare.com/ajax/libs/autonumeric/4.8.1/autoNumeric.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="{{asset('mofi/assets/js/system/globalfn.js')}}"></script>
<script src="{{asset('mofi/assets/js/system/transaksi/form_tagihan_non_bulanan.js')}}"></script>
@endsection
