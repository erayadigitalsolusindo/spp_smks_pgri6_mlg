@extends('paneladmin.templateadmin')
@section('konten_utama_admin')
<div class="row">
    <div class="col-sm-12">
    <div class="card">
        <div class="card-header">
          <h4>Jenis Pembayaran</h4><span>Silahkan inputkan data pada data jenis pembayaran di SMK PGRI 6 Malang. Jika jenis pembayaran sudah ada, sebisa mungkin jangan dihapus dikarenakan jenis pembayaran akan mempengaruhi data pembayaran siswa. Jenis pembayaran sudah tidak digunakan abaikan karena jika terhapus data tidak bisa ditampilkan secara visual.</span>
          <button class="btn btn-primary btn w-100" id="tombol_tambah_jenis_pembayaran"><i class="fa fa-plus"></i> Tambah Jenis Pembayaran</button>
        </div>
        <div class="card-body">
          <div class="col-md-12">
            <input type="text" class="form-control" id="kotak_pencarian_jenis_pembayaran" placeholder="Cari data berdasarkan nama jenis pembayaran yang tersedia">
            <div class="table">
              <table class="display" id="datatables_jenis_pembayaran"></table>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
<div class="modal fade" id="formulir_tambah_informasi_siswa" tabindex="-1" aria-labelledby="formulir_tambah_informasi_siswaLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="formulir_tambah_informasi_siswaLabel">Tambah Jenis Pembayaran</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="kode" class="form-label">Kode Jenis Pembayaran</label>
              <input type="text" class="form-control" id="kode" name="kode" maxlength="255" required>
            </div>
            <div class="mb-3">
              <label for="jenis_transaksi" class="form-label">Nama Jenis Pembayaran</label>
              <input type="text" class="form-control" id="jenis_transaksi" name="jenis_transaksi" maxlength="255" required>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger" data-bs-dismiss="modal">Batal</button>
            <button id="simpan_data_tambah_informasi_siswa" class="btn btn-primary">Simpan Data</button>
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
<script src="{{asset('mofi/assets/js/system/master_data/jenis_pembayaran.js')}}"></script>
@endsection
