@extends('paneladmin.templateadmin')
@section('konten_utama_admin')
<div class="row">
    <div class="col-sm-12">
    <div class="card">
        <div class="card-header">
          <h4>Data Tagihan</h4><span>Silahkan inputkan data pada data tagihan siswa di SMK PGRI 6 Malang. Jikalau siswa yang belum terdaftar pada daftar tagihan maka siswa tersebut tidak dapat melakukank transkasi pembayaran yang ada di SMK PGRI6 Malang.</span>
          <a href="{{route('spp.form_tagihan_non_bulanan')}}" class="btn btn-success w-100 mt-2" id="btnTambahInformasiTagihan"><i class="fa fa-plus"></i> Tambah Informasi Tagihan Siswa</a>
        </div>
        <div class="card-body">
          <div class="col-md-12">
            <div class="input-group">
              <select class="form-control" id="filter_tingkat_kelas_tagihan">
                <option value="">Pilih Tingkat Kelas</option>
                @foreach ($data['informasi_kelas'] as $item)
                  <option value="{{$item->id}}">{{$item->tingkat_kelas}}</option>
                @endforeach
              </select>
              <button class="btn"> ATAU </button>
              <input type="text" class="form-control" id="kotak_pencarian_tagihan" placeholder="Cari data berdasarkan nama kelas yang tersedia">
              <select class="form-control" id="filter_tahun_ajaran_tagihan">
                <option value="">Pilih Tahun Ajaran</option>
                @foreach ($data['informasi_tahun_ajaran'] as $item)
                  <option value="{{$item->id_tahun_ajaran}}">{{$item->tahun_ajaran}}</option>
                @endforeach
              </select>
            </div>
            <button class="btn btn-primary w-100 mt-2" id="proses_tagihan"><i class="fa fa-search"></i> Cek Tagihan</button>
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
              <h5 class="modal-title" id="formulir_edit_tagihanLabel">Edit Tagihan Nama : <span id="nama_siswa_tagihan"></span><span style="display: none;" id="id_siswa_tagihan"></span></h5>
              <button type="button btn-danger" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="table">
              <table class="display" id="datatables_tagihan_siswa">
                <thead>
                  <tr>
                    <th class="text-center">Kuantiti</th>
                    <td><input type="text" class="form-control" id="kuantiti" placeholder="bayar Berapa X Per Tahun Ajaran"></td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th class="text-center">Nominal</th>
                    <td><input type="text" class="form-control" id="nominal" placeholder="Tagihan"></td>
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
<script src="{{asset('mofi/assets/js/system/transaksi/tagihan_non_bulanan.js')}}"></script>
@endsection