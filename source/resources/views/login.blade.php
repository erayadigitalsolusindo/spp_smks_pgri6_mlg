@extends('templatebody')
@section('konten_utama')
<div class="container-fluid">
  <div class="row">
    <div class="col-xl-7"><img class="bg-img-cover bg-center" src="{{asset('mofi/assets/images/login/2.jpg')}}" alt="looginpage"></div>
    <div class="col-xl-5 p-0">
      <div class="login-card login-dark">
        <div>
          <div class="d-flex justify-content-center">
            <a class="logo text-center" href="{{url('')}}">
                <img class="img-fluid mx-auto d-block" src="{{asset('mofi/assets/images/logo/Logo_AMC_Full.png')}}" alt="looginpage">
            </a>
          </div>
          <div class="login-main"> 
            <div class="theme-form">
              <h4>Masukan Identitas Terdaftar </h4>
              <p>Ketikan Surel / Nama Pengguna dan Katasandi Terdaftar</p>
              <div class="form-group">
                <label class="col-form-label">Alamat Surel / Nama Pengguna</label>
                <input autocomplete="off" value="erayadigitalstudio" class="form-control" type="text" id="namapengguna" required="" placeholder="hallo@arthamedicalcenter.com">
              </div>
              <div class="form-group">
                <label class="col-form-label">Katasandi</label>
                <div class="form-input position-relative">
                  <input autocomplete="off" value="Salam1jiwa" class="form-control" name="password" type="password" id="katasandi" required="" placeholder="*********">
                  <div class="show-hide"><span class="show"></span></div>
                </div>
              </div>
              <div class="form-group mb-0">
                <div class="checkbox p-0">
                  <input id="checkbox1" type="checkbox">
                  <label class="text-muted" for="checkbox1">Ingat Katasandi</label>
                </div>
                <button class="btn btn-primary btn-block w-100" id="btn_login">Kirim Data</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection
@section('css_load')
@endsection
@section('js_load')
<script src="{{asset('mofi/assets/js/script.js')}}"></script>
<script src="{{asset('mofi/assets/js/system/login.js')}}"></script>
@endsection