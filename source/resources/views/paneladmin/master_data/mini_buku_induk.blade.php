@extends('paneladmin.templateadmin')
@section('konten_utama_admin')
<div class="row">
    <div class="col-sm-12">
    <div class="card">
        <div class="card-header">
          <h4>Data Mini Buku Induk</h4><span>Silahkan inputkan data pada data mini buku induk di SMK PGRI 6 Malang.</span>
          <button class="btn btn-primary w-100" id="tambah_informasi_siswa"><i class="fa fa-plus"></i> Tambah Informasi Siswa</button>
        </div>
        <div class="card-body">
          <div class="col-md-12">
                <input type="text" class="form-control" id="kotak_pencarian_mini_buku_induk" placeholder="Cari data berdasarkan nama siswa yang tersedia">
            <div class="table">
              <table class="display" id="datatables_mini_buku_induk"></table>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
<div class="modal modal-lg fade" id="formulir_tambah_informasi_siswa" tabindex="-1" aria-labelledby="formulir_tambah_informasi_siswaLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="formulir_tambah_informasi_siswaLabel">Tambah Informasi Siswa</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="id_kelas" class="form-label">Kelas</label>
            <select class="form-select" id="id_kelas" name="id_kelas" required>
              <option value="" selected disabled>Pilih Kelas</option>
              @foreach ($data['informasi_kelas'] as $kelas)
                <option value="{{$kelas->id}}">{{$kelas->tingkat_kelas}}</option>
              @endforeach
            </select>
          </div>
          <div class="mb-3">
            <label for="nis" class="form-label">NIS</label>
            <input type="text" class="form-control" id="nis" name="nis" maxlength="255" required>
            <input type="hidden" id="id_siswa" name="id_siswa">
          </div>
          <div class="mb-3">
            <label for="nisn" class="form-label">NISN</label>
            <input type="text" class="form-control" id="nisn" name="nisn" maxlength="255">
          </div>
          <div class="mb-3">
            <label for="nama_siswa" class="form-label">Nama Siswa</label>
            <input type="text" class="form-control" id="nama_siswa" name="nama_siswa" maxlength="255" required>
          </div>
          <div class="mb-3">
            <label for="alamat_siswa" class="form-label">Alamat</label>
            <textarea class="form-control" id="alamat_siswa" name="alamat_siswa" rows="3"></textarea>
          </div>
          <div class="mb-3">
            <label for="no_telepon" class="form-label">Nomor Telepon</label>
            <input type="text" class="form-control" id="no_telepon" name="no_telepon" maxlength="15">
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email" maxlength="255">
          </div>
          <div class="mb-3">
            <label for="jenis_kelamin" class="form-label">Jenis Kelamin</label>
            <select class="form-select" id="jenis_kelamin" name="jenis_kelamin">
              <option value="" selected disabled>Pilih Jenis Kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="id_tahun_ajaran" class="form-label">Tahun Ajaran</label>
            <select class="form-select" id="id_tahun_ajaran" name="id_tahun_ajaran" required>
              <option value="" selected disabled>Pilih Tahun Ajaran</option>
              @foreach ($data['informasi_tahun_ajaran'] as $tahun_ajaran)
                <option value="{{$tahun_ajaran->id_tahun_ajaran}}">{{$tahun_ajaran->tahun_ajaran}}</option>
              @endforeach
            </select>
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
<script src="{{asset('mofi/assets/js/system/master_data/mini_buku_induk.js')}}"></script>
@endsection