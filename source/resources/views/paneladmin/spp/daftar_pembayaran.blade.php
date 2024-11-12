@extends('paneladmin.templateadmin')
@section('konten_utama_admin')
<div class="row">
    <div class="col-sm-12">
    <div class="card">
        <div class="card-header">
          <h4>Data Pembayaran</h4><span>Berikut daftar pembayaran yang sudah dilakukan oleh siswa yang terdaftar. Anda dapat mengelola data tersebut entah merubah dan menghapus data tersebut. Harap berhati-hati dalam menghapus dan mengubah data, karena jika data sudah terlanjur dihapus maka data tersebut tidak dapat dikembalikan lagi.</span>
          <a href="{{route('spp.transaksi_pembayaran')}}" class="btn btn-success w-100 mt-2" id="btnTambahPembayaran">
            <i class="fa fa-plus"></i> Tambah Pembayaran
          </a>
        </div>
        <div class="card-body">
          <div class="col-md-12">
            <input type="text" class="form-control" id="kotak_pencarian_daftar_pembayaran" placeholder="Cari data berdasarkan nama kelas yang tersedia">
            <div class="table">
              <table class="display" id="datatables_daftar_pembayaran"></table>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
<div class="modal fade" id="modalDetailTransaksi" tabindex="-1" role="dialog" aria-labelledby="modalDetailTransaksiLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalDetailTransaksiLabel">Detail Transaksi</h5>
            </div>
            <div class="modal-body">
                <input type="text" class="form-control" id="pencarian_detail_transaksi_daftar_pembayaran" placeholder="Masukan Keterangan Pembayaran">
                <div class="table">
                    <table class="display" id="datatables_detail_transaksi_daftar_pembayaran">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Bulan</th>
                          <th>Nominal</th>
                          <th>Keterangan</th>
                        </tr>
                      </thead>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Tutup</button>
            </div>
        </div>
    </div>
</div>
@endsection
@section('css_load')
@component('komponen.css.datatables')
@endcomponent
@endsection
@section('js_load')
@component('komponen.js.datatables')
@endcomponent
<script src="{{asset('mofi/assets/js/system/globalfn.js')}}"></script>
<script src="{{asset('mofi/assets/js/system/transaksi/daftar_pembayaran.js')}}"></script>
@endsection
