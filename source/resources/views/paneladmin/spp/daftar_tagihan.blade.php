@extends('paneladmin.templateadmin')
@section('konten_utama_admin')
<div class="row">
    <div class="col-sm-12">
    <div class="card">
        <div class="card-header">
          <h4>Data Tagihan</h4><span>Silahkan inputkan data pada data tagihan siswa di SMK PGRI 6 Malang. Jikalau siswa yang belum terdaftar pada daftar tagihan maka siswa tersebut tidak dapat melakukank transkasi pembayaran yang ada di SMK PGRI6 Malang.</span>
          <a href="{{route('spp.form_tagihan')}}" class="btn btn-success w-100 mt-2" id="btnTambahInformasiTagihan"><i class="fa fa-plus"></i> Tambah Informasi Tagihan Siswa</a>
        </div>
        <div class="card-body">
          <div class="col-md-12">
            <input type="text" class="form-control" id="kotak_pencarian_tagihan" placeholder="Cari data berdasarkan nama kelas yang tersedia">
            <div class="table">
              <table class="display" id="datatables_tagihan"></table>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
<div class="modal modal-lg fade" id="form_edit_tagihan" tabindex="-1" aria-labelledby="formulir_edit_tagihanLabel" aria-hidden="true">
  <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="formulir_edit_tagihanLabel">Edit Tagihan Nama : <span id="nama_siswa_tagihan"></span><span id="id_siswa_tagihan"></span></h5>
              <button type="button btn-danger" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="table">
              <table class="display" id="datatables_tagihan_siswa">
                <thead>
                  <tr>
                    <th class="text-center">Bulan</th>
                    <th class="text-center">Nominal</th>
                    <th class="text-center">Bulan</th>
                    <th class="text-center">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Tagihan Juli</td>
                    <td><input type="text" class="form-control" id="tagihan_juli" placeholder="Tagihan Juli"></td>
                    <td>Tagihan Januari</td>
                    <td><input type="text" class="form-control" id="tagihan_januari" placeholder="Tagihan Januari"></td>
                  </tr>
                  <tr>
                    <td>Tagihan Agustus</td>
                    <td><input type="text" class="form-control" id="tagihan_agustus" placeholder="Tagihan Agustus"></td>
                    <td>Tagihan Februari</td>
                    <td><input type="text" class="form-control" id="tagihan_februari" placeholder="Tagihan Februari"></td>
                  </tr>
                  <tr>
                    <td>Tagihan September</td>
                    <td><input type="text" class="form-control" id="tagihan_september" placeholder="Tagihan September"></td>
                    <td>Tagihan Maret</td>
                    <td><input type="text" class="form-control" id="tagihan_maret" placeholder="Tagihan Maret"></td>
                  </tr>
                  <tr>
                    <td>Tagihan Oktober</td>
                    <td><input type="text" class="form-control" id="tagihan_oktober" placeholder="Tagihan Oktober"></td>
                    <td>Tagihan April</td>
                    <td><input type="text" class="form-control" id="tagihan_april" placeholder="Tagihan April"></td>
                  </tr>
                  <tr>
                    <td>Tagihan November</td>
                    <td><input type="text" class="form-control" id="tagihan_november" placeholder="Tagihan November"></td>
                    <td>Tagihan Mei</td>
                    <td><input type="text" class="form-control" id="tagihan_mei" placeholder="Tagihan Mei"></td>
                  </tr>
                  <tr>
                    <td>Tagihan Desember</td>
                    <td><input type="text" class="form-control" id="tagihan_desember" placeholder="Tagihan Desember"></td>
                    <td>Tagihan Juni</td>
                    <td><input type="text" class="form-control" id="tagihan_juni" placeholder="Tagihan Juni"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Batal</button>
              <button type="submit" onclick="simpan_tagihan_siswa_update()" id="simpan_tagihan_siswa_update" class="btn btn-primary">Simpan Data</button>
          </div>
      </div>
  </div>
</div>
@endsection
@section('css_load')
@component('komponen.css.datatables')
@endcomponent
<style>
#datatables_permission_tersedia tbody td,
#datatables_role tbody td {
    padding-top: 2px;
    padding-bottom: 2px;
}
</style>
@endsection
@section('js_load')
@component('komponen.js.datatables')
@endcomponent
<script src="https://cdnjs.cloudflare.com/ajax/libs/autonumeric/4.8.1/autoNumeric.min.js"></script>
<script src="{{asset('mofi/assets/js/system/transaksi/tagihan.js')}}"></script>
@endsection