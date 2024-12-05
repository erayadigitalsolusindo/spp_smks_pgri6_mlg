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
<div class="modal modal-lg fade" id="form_edit_tagihan" tabindex="-1" aria-labelledby="formulir_edit_tagihanLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
  <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="formulir_edit_tagihanLabel">Edit Tagihan Nama : <span id="nama_siswa_tagihan"></span><span style="display: none" id="id_siswa_tagihan"></span></h5>
              <button type="button btn-danger" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="table table-responsive">
              <table class="display" id="datatables_tagihan_siswa">
                <thead>
                  <tr>
                    <th class="text-center">Bulan</th>
                    <th class="text-center">Sisa Tagihan</th>
                    <th class="text-center">Nominal Tagihan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Tagihan Juli</td>
                    <td><input type="text" class="form-control" id="juli" placeholder="Juli"></td>
                    <td><input type="text" class="form-control" id="tagihan_juli" placeholder="Tagihan Juli"></td>
                  <tr>
                    <td>Tagihan Agustus</td>
                    <td><input type="text" class="form-control" id="agustus" placeholder="Agustus"></td>
                    <td><input type="text" class="form-control" id="tagihan_agustus" placeholder="Tagihan Agustus"></td>
                  </tr>
                  <tr>
                    <td>Tagihan September</td>
                    <td><input type="text" class="form-control" id="september" placeholder="September"></td>
                    <td><input type="text" class="form-control" id="tagihan_september" placeholder="Tagihan September"></td>
                  </tr>
                  <tr>
                    <td>Tagihan Oktober</td>
                    <td><input type="text" class="form-control" id="oktober" placeholder="Oktober"></td>
                    <td><input type="text" class="form-control" id="tagihan_oktober" placeholder="Tagihan Oktober"></td>
                  </tr>
                  <tr>
                    <td>Tagihan November</td>
                    <td><input type="text" class="form-control" id="november" placeholder="November"></td>
                    <td><input type="text" class="form-control" id="tagihan_november" placeholder="Tagihan November"></td>
                  </tr>
                  <tr>
                    <td>Tagihan Desember</td>
                    <td><input type="text" class="form-control" id="desember" placeholder="Desember"></td>
                    <td><input type="text" class="form-control" id="tagihan_desember" placeholder="Tagihan Desember"></td>
                  </tr>
                  <tr>
                    <td>Tagihan Januari</td>
                    <td><input type="text" class="form-control" id="januari" placeholder="Januari"></td>
                    <td><input type="text" class="form-control" id="tagihan_januari" placeholder="Tagihan Januari"></td>
                  </tr>
                  <tr>
                    <td>Tagihan Febuari</td>
                    <td><input type="text" class="form-control" id="febuari" placeholder="Febuari"></td>
                    <td><input type="text" class="form-control" id="tagihan_febuari" placeholder="Tagihan Febuari"></td>
                  </tr>
                  <tr>
                    <td>Tagihan Maret</td>
                    <td><input type="text" class="form-control" id="maret" placeholder="Maret"></td>
                    <td><input type="text" class="form-control" id="tagihan_maret" placeholder="Tagihan Maret"></td>
                  </tr>
                  <tr>
                    <td>Tagihan April</td>
                    <td><input type="text" class="form-control" id="april" placeholder="April"></td>
                    <td><input type="text" class="form-control" id="tagihan_april" placeholder="Tagihan April"></td>
                  </tr>
                  <tr>
                    <td>Tagihan Mei</td>
                    <td><input type="text" class="form-control" id="mei" placeholder="Mei"></td>
                    <td><input type="text" class="form-control" id="tagihan_mei" placeholder="Tagihan Mei"></td>
                  </tr>
                  <tr>
                    <td>Tagihan Juni</td>
                    <td><input type="text" class="form-control" id="juni" placeholder="Juni"></td>
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
<link href="https://cdn.datatables.net/keytable/2.12.1/css/keyTable.bootstrap5.css" rel="stylesheet">
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
<script src="https://cdn.datatables.net/keytable/2.12.1/js/dataTables.keyTable.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/autonumeric/4.8.1/autoNumeric.min.js"></script>
<script src="{{asset('mofi/assets/js/system/transaksi/tagihan.js')}}"></script>
@endsection