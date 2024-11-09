@extends('paneladmin.templateadmin')
@section('konten_utama_admin')
<div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header">
          <h4>Fitur Aplikasi Pengaturan Izin Aplikasi</h4><span>Pada tampilan ini anda dapat mengatur izin aplikasi pada sistem MCU Artha Medica berdasarkan role yang telah dibuat agar pengguna dapat memiliki akses mana saja yang ingin diakses seperti menu, sistem simpan, cetak, dan lainnya. Perubahan akan aktif jika pengguna melakukan masuk ulang ke sistem.</span>
        </div>
        <div class="card-body">
          <div class="col-md-12 position-relative">
            <label class="form-label" for="nama_hakakses">Nama Hak Izin Sistem</label>
            <input class="form-control" type="text" placeholder="Ex: Buka Menu EKG" id="nama_hakakses">
            <label class="form-label" for="nama_group">Group</label>
            <input class="form-control" type="text" placeholder="Ex: EKG" id="nama_group">
            <label class="form-label" for="keterangan">Keterangan Hak izin Sistem</label>
            <div class="input-group">
              <input class="form-control" type="text" placeholder="Ex: Pengguna dapat membuka menu EKG" id="keterangan">
                <button class="btn btn-outline-success" id="simpan_hakakses" type="button">Simpan Data</button>
            </div>
          </div>
          <div class="title text-center mt-2">
            <h2 class="sub-title">Tabel Informasi Hak Akses Sistem</h2>
          </div>
          <div class="col-md-12">
            <input type="text" class="form-control" id="kotak_pencarian" placeholder="Cari data berdasarkan nama hak akses">
            <div class="table">
              <table class="table display" id="datatables_permission"></table>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="editRoleModal" tabindex="-1" aria-labelledby="editRoleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editRoleModalLabel">Edit Hak Akses</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <input type="hidden" class="form-control" id="idhakakses" name="idhakakses" readonly>
                <label for="namahakakses" class="form-label">Nama Hak Akses</label>
                <input type="text" class="form-control" id="namahakakses" name="namahakakses" required>
              </div>
              <div class="mb-3">
                <label for="keteranganhakakses" class="form-label">Keterangan Hak Akses</label>
                  <input type="text" class="form-control" id="keteranganhakakses" name="keteranganhakakses" required>
              </div>
            </div>
            <div class="modal-footer">
                <button id="update_hakakses" class="btn btn-primary">Simpan Data</button>
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
<script src="{{asset('mofi/assets/js/system/permission.js')}}"></script>
@endsection