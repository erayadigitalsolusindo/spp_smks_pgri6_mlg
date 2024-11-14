@extends('paneladmin.templateadmin')
@section('konten_utama_admin')
<div class="row default-dashboard">
    <div class="col-sm-12">
        <div class="card">
            <div class="card-header">
                <h4>Formulir Transaksi SPP</h4>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-7">
                        <select class="form-control" id="select_siswa_transaksi_spp"></select>
                    </div>
                    <div class="col-md-3">
                        <input type="text" style="font-size: 22px;" class="form-control" id="tanggal_transaksi_spp" name="tanggal_transaksi_spp" placeholder="Tanggal Transaksi" placeholder="dd-mm-yyyy">
                    </div>
                    <div class="col-md-2">
                      <button class="btn btn-success w-100 btn-lg" id="btnLihatInformasiSiswa">
                        <i class="fa fa-eye"></i> Lihat Biodata
                      </button>
                  </div>
                </div>

                <div class="row" id="kartu_informasi_peserta">
                    <div class="col-xl-7 col-md-6 proorder-xl-1 proorder-md-1">  
                        <div class="card profile-greeting p-0">
                            <div class="card-body">
                                <div class="img-overlay">
                                    <h2>Hai, <span id="nama_peserta_temp"></span></h2>
                                    <p>Formulir untuk kelengkapan transaksi pembayaran SPP sesuai dengan data siswa yang terdaftar serta jangan lupa jenis pembayaran yang dipilih sesuai dengan jenis pembayaran yang terdaftar.</p>
                                    <button class="btn btn-secondary" id="btnPanduanHalamanIni">Panduan Halaman Ini</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-5 col-md-6 proorder-md-5"> 
                        <div class="card">
                            <div class="card-header card-no-border pb-0">
                                <div class="header-top">
                                    <h4>Informasi Peserta</h4>
                                    <div class="location-menu dropdown">
                                        <button class="btn btn-danger" type="button">Dibuat pada : <span id="created_at_temp">{{date('d-m-Y')}}</span></button>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body live-meet">
                                <table class="table table-borderless" style="padding: 0;">
                                    <tbody>
                                        <tr>
                                            <td style="padding: 0;">Nomor Induk Siswa</td>
                                            <td style="padding: 0;">
                                                <span id="id_temp" style="display: none;"></span>
                                                <span id="nomor_induk_siswa_temp"></span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 0;">Nama Siswa</td>
                                            <td style="padding: 0;"><span id="nama_siswa_temp"></span></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 0;">Jenis Kelamin</td>
                                            <td style="padding: 0;"><span id="jenis_kelamin_temp"></span></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 0;">Alamat</td>
                                            <td style="padding: 0;"><span id="alamat_temp"></span></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 0;">No. HP Peserta</td>
                                            <td style="padding: 0;"><span id="no_telepon_temp"></span></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 0;">Email Peserta</td>
                                            <td style="padding: 0;"><span id="email_temp"></span></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 0;">Kelas</td>
                                            <td style="padding: 0;"><span id="kelas_temp"></span></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 0;">Tahun Ajaran</td>
                                            <td style="padding: 0;"><span id="tahun_ajaran_temp"></span><span style="display: none;" id="kode_tahun_ajaran_temp"></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" id="keranjang_pembayaran">
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="text-start" style="font-family: 'DS-Digital', sans-serif; font-size: 5vw; color: red;">
                        <strong>IDR</strong>
                    </span>
                    <input type="text" value="0" class="form-control text-end" id="nominal_bayar_konfirmasi" name="nominal_bayar_konfirmasi" placeholder="0.00" readonly>
                </div>

                <div class="col-md-12">
                    <div class="card-wrapper border rounded-3 h-100 checkbox-checked">
                        <h6 class="sub-title text-center">Pilih Bulan Pembayaran</h6>
                        <div class="form-check checkbox checkbox-primary ps-0 main-icon-checkbox">
                            <ul class="checkbox-wrapper" id="list_bulan_pembayaran">
                                <li> 
                                    <input class="form-check-input checkbox-shadow" id="juli" type="checkbox">
                                    <label class="form-check-label" for="juli"><span>Juli</span></label>
                                </li>
                                <li> 
                                    <input class="form-check-input checkbox-shadow" id="agustus" type="checkbox">
                                    <label class="form-check-label" for="agustus"><span>Agustus</span></label>
                                </li>
                                <li> 
                                    <input class="form-check-input checkbox-shadow" id="september" type="checkbox">
                                    <label class="form-check-label" for="september"><span>September</span></label>
                                </li>
                                <li> 
                                    <input class="form-check-input checkbox-shadow" id="oktober" type="checkbox">
                                    <label class="form-check-label" for="oktober"><span>Oktober</span></label>
                                </li>
                                <li> 
                                    <input class="form-check-input checkbox-shadow" id="november" type="checkbox">
                                    <label class="form-check-label" for="november"><span>November</span></label>
                                </li>
                                <li> 
                                    <input class="form-check-input checkbox-shadow" id="desember" type="checkbox">
                                    <label class="form-check-label" for="desember"><span>Desember</span></label>
                                </li>
                                <li> 
                                    <input class="form-check-input checkbox-shadow" id="januari" type="checkbox">
                                    <label class="form-check-label" for="januari"><span>Januari</span></label>
                                </li>
                                <li> 
                                    <input class="form-check-input checkbox-shadow" id="februari" type="checkbox">
                                    <label class="form-check-label" for="februari"><span>Februari</span></label>
                                </li>
                                <li> 
                                    <input class="form-check-input checkbox-shadow" id="maret" type="checkbox">
                                    <label class="form-check-label" for="maret"><span>Maret</span></label>
                                </li>
                                <li> 
                                    <input class="form-check-input checkbox-shadow" id="april" type="checkbox">
                                    <label class="form-check-label" for="april"><span>April</span></label>
                                </li>
                                <li> 
                                    <input class="form-check-input checkbox-shadow" id="mei" type="checkbox">
                                    <label class="form-check-label" for="mei"><span>Mei</span></label>
                                </li>
                                <li> 
                                    <input class="form-check-input checkbox-shadow" id="juni" type="checkbox">
                                    <label class="form-check-label" for="juni"><span>Juni</span></label>
                                </li>
                            </ul>
                        </div>
                    </div>             
                </div>

                <div class="col-md-4">
                    <select class="form-control" id="select_jenis_pembayaran_transaksi_spp"></select>
                </div>
                <div class="col-md-4">
                    <input type="text" class="form-control text-end" id="nominal_pembayaran_transaksi_spp" name="nominal_pembayaran_transaksi_spp" placeholder="0.00">
                </div>
                <div class="col-md-4">
                    <button class="btn btn-success w-100 btn-lg" style="font-size: 22px;" id="btnTambahJenisPembayaranTransaksiSPP">
                        <i class="fa fa-cart-plus"></i> Masukan Keranjang
                    </button>
                </div>

                <div class="table-responsive theme-scrollbar">
                    <table class="display" id="datatables_transaksi_spp">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Kode Jenis</th>
                                <th>Jenis Pembayaran</th>
                                <th>Bulan Terbayar</th>
                                <th>Nominal Pembayaran</th>
                                <th>Keterangan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
                </div>
                <button class="btn btn-success w-100 btn-lg mt-2" id="btnKonfirmasiTransaksiSPP">
                    <i class="fa fa-check"></i> Konfirmasi Transaksi
                </button>
            </div>
        </div>
    </div>
</div>
@endsection
@section('css_load')
@component('komponen.css.datatables')
@endcomponent
<link href="https://fonts.cdnfonts.com/css/ds-digital" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<link rel="stylesheet" type="text/css" href="{{ asset('mofi/assets/css/vendors/flatpickr/flatpickr.min.css') }}">
<style>
.select2-container--default .select2-selection--single .select2-selection__arrow {
    margin-top: 10px;
    margin-right: 10px;
}
.select2-container--open .select2-dropdown--below {
    margin-top: -20px;
    border-top-left-radius:2;
    border-top-right-radius:2;
}
#nominal_bayar_konfirmasi{
    text-align: right;
    font-family: 'DS-Digital', sans-serif;
    font-size: 5vw;
    color: red;
    padding: 0; 
    line-height: 1;
    font-weight: bold;
}
#nominal_bayar_konfirmasi::placeholder {
    font-family: 'DS-Digital', sans-serif;
    font-size: 5vw;
    color: red;
}
#nominal_pembayaran_transaksi_spp, .nominal_pembayaran{
    text-align: right;
    font-family: 'DS-Digital', sans-serif;
    font-size: 45px;
    color: red;
    padding: 0; 
    line-height: 1;
    font-weight: bold;
}
#nominal_pembayaran_transaksi_spp::placeholder, .nominal_pembayaran::placeholder {
    font-family: 'DS-Digital', sans-serif;
    font-size: 45px;
    color: red;
}
.radio-wrapper, .checkbox-wrapper {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  gap: 0;
  -ms-flex-wrap: wrap;
  flex-wrap: nowrap;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
</style>
@endsection
@section('js_load')
@component('komponen.js.datatables')
@endcomponent
<script>
    let transaksi_detail = {{isset($data['id_transaksi']) ? $data['id_transaksi'] : "-1"}};
</script>
<script src="{{ asset('mofi/assets/js/flat-pickr/flatpickr.js') }}"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/autonumeric/4.8.1/autoNumeric.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="{{asset('mofi/assets/js/system/globalfn.js')}}"></script>
<script src="{{asset('mofi/assets/js/system/transaksi/transaksi.js')}}"></script>
@endsection
