@extends('paneladmin.templateadmin')
@section('konten_utama_admin')
<div class="row">
    <div class="col-sm-12">
    <div class="card">
        <div class="card-header">
          <h4>Data Kelas</h4><span>Silahkan inputkan data pada data kelas siswa di SMK PGRI 6 Malang.</span>
        </div>
        <div class="card-body">
          <div class="col-md-12">
            <input type="text" class="form-control" id="kotak_pencarian_kelas" placeholder="Cari data berdasarkan nama kelas yang tersedia">
            <div class="table">
              <table class="display" id="datatables_kelas"></table>
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
<script src="{{asset('mofi/assets/js/system/role.js')}}"></script>
@endsection