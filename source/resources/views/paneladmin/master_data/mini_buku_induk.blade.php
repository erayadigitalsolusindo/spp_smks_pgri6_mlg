@extends('paneladmin.templateadmin')
@section('konten_utama_admin')
<div class="row">
    <div class="col-sm-12">
    <div class="card">
        <div class="card-header">
          <h4>Data Mini Buku Induk</h4><span>Silahkan inputkan data pada data mini buku induk di SMK PGRI 6 Malang.</span>
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