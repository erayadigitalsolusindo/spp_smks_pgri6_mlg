@extends('paneladmin.templateadmin')
@section('konten_utama_admin')
<div class="row">
    <div class="col-sm-12">
    <div class="card">
        <div class="card-header">
          <h4>Laporan Pembayaran</h4><span>Berikut adalah tampilan untuk melihat laporan pembayaran yang dilakukan oleh siswa. Pada halaman ini anda tidak dapat mengubah data yang ada, laporan hanya bisa dicetak dan dilihat saja. Jikalau ada kesalahan pada data, silahkan hubungi admin atau cek kembali data pada halaman <a href="{{route('spp.daftar_pembayaran')}}">Daftar Pembayaran</a>.</span>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-8">
                    <div class="form-group">
                        <label for="kotak_pencarian_laporan_pembayaran">Parameter Pencarian</label>
                        <input type="text" class="form-control" id="kotak_pencarian_laporan_pembayaran" placeholder="Cari data berdasarkan nama siswa, nis, atau nomor transaksi">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="kotak_tanggal_laporan_pembayaran">Filter Berdasarkan Tanggal</label>
                        <input type="date" class="form-control" id="kotak_tanggal_laporan_pembayaran" placeholder="dd-mm-yyyy">
                    </div>
                </div>
                <div class="col-md-12 mt-2">
                    <button class="btn btn-primary w-100" id="proses_laporan_pembayaran">Proses Laporan</button>
                </div>
            </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
            <h4 class="text-center" id="judul_laporan_pembayaran"></h4>
        </div>
        <div class="card-body">
            <div class="col-md-12" id="tampilan_laporan_pembayaran">
                <div style="font-size: 25px;" >Laporan Pendapatan : <span id="total_nominal"></span></div>
                <div class="table">
                    <table class="display" id="datatables_laporan_pembayaran"></table>
                </div>
            </div>
        </div>
      </div>
    </div>
</div>
@endsection
@section('css_load')
@component('komponen.css.datatables')
@endcomponent
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
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
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script src="{{asset('mofi/assets/js/system/laporan/laporan_pembayaran.js')}}"></script>
@endsection