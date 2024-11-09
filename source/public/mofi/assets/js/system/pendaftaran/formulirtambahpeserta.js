const nominalBayar = new AutoNumeric('#nominal_bayar', { digitGroupSeparator: '.', decimalCharacter: ',', decimalPlaces: 2,});
const nominalKembalian = new AutoNumeric('#nominal_kembalian', { digitGroupSeparator: '.', decimalCharacter: ',', decimalPlaces: 2,});
const nominalBayarKonfirmasi = new AutoNumeric('#nominal_bayar_konfirmasi', { digitGroupSeparator: '.', decimalCharacter: ',', decimalPlaces: 2,});
let formValidasi = $('#formulir_pendaftaran_peserta');
$(document).ready(function() {
    callselect2mcu()
    updateCardStyles()
    onload()
    
});
function onload(){
    flatpickr("#tanggal_lahir", {
        dateFormat: "d-m-Y",
        maxDate: moment().subtract(15, 'years').format('DD-MM-YYYY'),
    });
    $('#tanggal_pendaftaran').val(moment().format("DD-MM-YYYY"));
    flatpickr("#tanggal_pendaftaran", {
        dateFormat: "d-m-Y",
        maxDate: "today",
    });
    

}
$("#btnKonfirmasiPendaftaran").on("click", function(event) {
    event.preventDefault();
    formValidasi.addClass('was-validated');
    if ($("#nomor_identitas").val() == "" || $("#nama_peserta").val() == "" || $("#tempat_lahir").val() == "" || $("#tanggal_lahir_peserta").val() == "" || $("#select2_perusahaan").val() == "" || $("#select2_departemen").val() == "") {
        return createToast('Kesalahan Penggunaan', 'top-right', 'Silahkan masukan data peserta untuk peserta ini sebelum anda melakukan transaksi selanjutnya', 'error', 3000);
    }
    if (nominalBayarKonfirmasi.getNumber() == 0) {
        return createToast('Kesalahan Penggunaan', 'top-right', 'Silahkan tentukan paket MCU untuk peserta ini sebelum anda melakukan transaksi selanjutnya', 'error', 3000);
    }
    $("#modalKonfimasiPendaftaran").modal("show");
});
function updateCardStyles() {
    if ($('#hutang').is(':checked')) {
        $('#card-hutang').css({'border': '2px solid #ccc', 'background-color': '#f8f9fa'});
        $('#card-tunai').css({'border': '', 'background-color': ''});
        nominalBayar.set(0);
        nominalKembalian.set(nominalBayarKonfirmasi.getNumber() * -1);
        $('#pembayaran_tunai').hide();
        $('#select2_metode_pembayaran')[0].selectedIndex = 0;
    } else if ($('#tunai').is(':checked')) {
        $('#card-tunai').css({'border': '2px solid #ccc', 'background-color': '#f8f9fa'});
        $('#card-hutang').css({'border': '', 'background-color': ''});
        $('#pembayaran_tunai').show();
        $('.transaksi_transfer').hide();
        $('#nominal_bayar').focus();
    }
}
$('input[name="tipe_pembayaran"]').on('change', updateCardStyles);
function callselect2mcu(){
    $.get('/generate-csrf-token', function(response) {
        $('#select2_perusahaan').select2({ 
            placeholder: 'Pilih Perusahaan',
            ajax: {
                url: baseurlapi + '/masterdata/daftarperusahaan',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token_ajax') },
                method: 'GET',
                dataType: 'json',
                delay: 500,
                data: function (params) {
                    return {
                        _token : response.csrf_token,
                        parameter_pencarian : (typeof params.term === "undefined" ? "" : params.term),
                        start : 0,
                        length : 1000,
                    }
                },
                processResults: function (data) {
                    return {
                        results: $.map(data.data, function (item) {
                            return {
                                text: `[${item.company_code}] - ${item.company_name}`,
                                id: item.id,
                            }
                        })
                    }
                    
                },
                error: function(xhr, status, error) {
                    return createToast('Kesalahan Penggunaan', 'top-right', xhr.responseJSON.message, 'error', 3000);
                }
            },
        }); 
        $('#select2_paket_mcu').select2({
            placeholder: 'Pilih Paket MCU',
            ajax: {
                url: baseurlapi + '/masterdata/daftarpaketmcu',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token_ajax') },
                method: 'GET',
                dataType: 'json',
                delay: 500,
                data: function (params) {
                    return {
                        _token: response.csrf_token,
                        parameter_pencarian: params.term || "",
                        start: 0,
                        length: 1000,
                    };
                },
                processResults: function (data) {
                    return {
                        results: $.map(data.data, function (item) {
                            return {
                                text: `[${item.kode_paket}] - ${item.nama_paket} | Harga : Rp ${new Intl.NumberFormat('id-ID').format(item.harga_paket)}`,
                                id: `${item.id}|${item.kode_paket}|${item.nama_paket}|${item.harga_paket}|${item.akses_poli}`,
                            };
                        })
                    };
                },
                error: function(xhr, status, error) {
                    return createToast('Kesalahan Penggunaan', 'top-right', xhr.responseJSON.message, 'error', 3000);
                }
            }
        });
        $('#select2_departemen').select2({ 
            placeholder: 'Pilih Departemen',
            ajax: {
                url: baseurlapi + '/masterdata/daftardepartemenpeserta',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token_ajax') },
                method: 'GET',
                dataType: 'json',
                delay: 500,
                data: function (params) {
                    return {
                        _token : response.csrf_token,
                        parameter_pencarian : (typeof params.term === "undefined" ? "" : params.term),
                        start : 0,
                        length : 1000,
                    }
                },
                processResults: function (data) {
                    return {
                        results: $.map(data.data, function (item) {
                            return {
                                text: `[${item.kode_departemen}] - ${item.nama_departemen}`,
                                id: `${item.id}`,
                            }
                        })
                    }
                    
                },
                error: function(xhr, status, error) {
                    return createToast('Kesalahan Penggunaan', 'top-right', xhr.responseJSON.message, 'error', 3000);
                }
            },
        }); 
        $('#pencarian_member_mcu').select2({ 
            placeholder: 'Masukan informasi member seperti Nomor Identitas / Nama',
            allowClear: true,
            ajax: {
                url: baseurlapi + '/masterdata/daftarmembermcu',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token_ajax') },
                method: 'GET',
                dataType: 'json',
                delay: 500,
                data: function (params) {
                    return {
                        _token : response.csrf_token,
                        parameter_pencarian : (typeof params.term === "undefined" ? "" : params.term),
                        start : 0,
                        length : 100,
                    }
                },
                processResults: function (data) {
                    return {
                        results: $.map(data.data, function (item) {
                            return {
                                text: `[${item.nomor_identitas}] - ${item.nama_peserta}`,
                                id: `${item.nomor_identitas}`,
                            }
                        })
                    }
                    
                },
                error: function(xhr, status, error) {
                    return createToast('Kesalahan Penggunaan', 'top-right', xhr.responseJSON.message, 'error', 3000);
                }
            },
        }); 
    });
}
let selectedDataPaketMCU = [];
$('#select2_paket_mcu').on('select2:select', function (e) {
    selectedDataPaketMCU = e.params.data.id.split('|');
    const aksesPoli = selectedDataPaketMCU[4];
    const aksesPoliElement = $('#akses_poli_dipilih');
    const aksesPoliElementKonfirmasi = $('#akses_poli_dipilih_konfirmasi');
    if (aksesPoliElement) {
        const poliList = aksesPoli.split(',');
        aksesPoliElement.empty();
        aksesPoliElement.addClass('text-center');
        poliList.forEach(poli => {
            aksesPoliElement.append(`<span class="badge badge-success me-2">${poli.trim()}</span>`);
        });
    }
    if (aksesPoliElementKonfirmasi) {
        const poliListKonfirmasi = aksesPoli.split(',');
        aksesPoliElementKonfirmasi.empty();
        aksesPoliElementKonfirmasi.append(`<div class="d-flex justify-content-center flex-wrap">`);
        poliListKonfirmasi.forEach(poli => {
            aksesPoliElementKonfirmasi.append(`<button class="btn btn-success me-2 mb-2">${poli.trim()}</button>`);
        });
        aksesPoliElementKonfirmasi.append(`</div>`);
    }
    nominalBayarKonfirmasi.set(selectedDataPaketMCU[3]);
    nominalKembalian.set(selectedDataPaketMCU[3] * -1);
}); 
$('#nominal_bayar').on('input', function(){
    hitungNominalBayar();
});
function hitungNominalBayar(){
    nominalKembalian.set((nominalBayarKonfirmasi.getNumber() - nominalBayar.getNumber()) * -1);
}
$('#btnSimpanPendaftaran').on('click', function(){
    if ($('#tunai').is(':checked')) {
        if ($('#select2_metode_pembayaran').val() == 0) {
            if (nominalKembalian.getNumber() < 0 && (nominalBayar.getNumber() == 0 && nominalBayarKonfirmasi.getNumber() == 0) && $('#select2_metode_pembayaran').val() == 0) {
                return createToast('Kesalahan Penggunaan', 'top-right', 'Nominal pembayaran masih kurang <strong style="color:red">'+((nominalKembalian.getNumber()* -1).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }))+'</strong> untuk transaksi MCU ini. Silahkan cek kembali nominal pembayaran anda', 'error', 3000);
            }
        }else{
            if ($('#surat_pengantar').val() == "") {
                if ($('#nomor_transaksi_transfer').val() == "") {
                    return createToast('Kesalahan Penggunaan', 'top-right', 'Bukti transaksi transfer tidak boleh kosong, karena digunakan untuk rekonsiliasi transaksi pada MCU', 'error', 3000);
                }
            }
        }
    }
    $.get('/generate-csrf-token', function(response){
        let selectedProsesKerja = [];
        $('input[name="proses_kerja"]:checked').each(function() {
            selectedProsesKerja.push($(this).val());
        });
        $.ajax({
            url: baseurlapi + '/transaksi/simpanpeserta',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token_ajax') },
            method: 'POST', 
            dataType: 'json',
            contentType: false,
            processData: false,
            data: (function() {
                const formData = new FormData();
                formData.append('id_detail_transaksi_mcu', id_detail_transaksi_mcu);
                formData.append('isedit', isedit);
                formData.append('nomor_identitas', $('#nomor_identitas').val());
                if ($('#type_data_peserta').val() == 1) {
                    formData.append('nama_peserta', $('#nama_peserta').val());
                    formData.append('tempat_lahir', $('#tempat_lahir').val());
                    formData.append('tanggal_lahir_peserta', $('#tanggal_lahir_peserta').val());
                    formData.append('tipe_identitas', $('#tipe_identitas').val());
                    formData.append('status_kawin', $('#status_kawin').val());
                    formData.append('jenis_kelamin', $('#jenis_kelamin').val());
                    formData.append('no_telepon', $('#no_telepon').val());
                    formData.append('email', $('#email').val());
                    formData.append('alamat', $('#alamat').val());
                }
                formData.append('_token', response.csrf_token);
                formData.append('type_data_peserta', $('#type_data_peserta').val());
                formData.append('tanggal_transaksi', $('#tanggal_pendaftaran').val());
                formData.append('perusahaan_id', $('#select2_perusahaan').val());
                formData.append('departemen_id', $('#select2_departemen').val());
                formData.append('id_paket_mcu', selectedDataPaketMCU[0]);
                formData.append('proses_kerja', JSON.stringify(selectedProsesKerja));
                formData.append('nominal_bayar_konfirmasi', nominalBayarKonfirmasi.getNumber());
                formData.append('tipe_pembayaran', $('input[name="tipe_pembayaran"]:checked').val());
                formData.append('metode_pembayaran', $('#select2_metode_pembayaran').val());
                formData.append('nominal_pembayaran', nominalBayar.getNumber());
                formData.append('penerima_bank', $('#beneficiary_bank').val());
                formData.append('nomor_transaksi_transfer', $('#nomor_transaksi_transfer').val());
                const fileInput = $('#surat_pengantar')[0];
                if (fileInput.files[0]) {
                    formData.append('nama_file_surat_pengantar', fileInput.files[0]);
                }
                return formData;
            })(),
            success: function(response_data){
                if (response_data.rc == 200) {
                    createToast('Berhasil', 'top-right', response_data.message, 'success', 3000);
                    return Swal.fire({
                        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/bf2bdd2d-1dac-4285-aa3d-9548be13b15d/zzf9qF3Q23.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player>Informasi berhasil disimpan ke dalam sistem MCU Artha Medica. Silahkan tambah informasi detail MCU berdasarkan Nomor Indetitas yang sudah didaftarkan ['+$('#nomor_identitas').val()+']. Aksi apa yang ingin anda lakukan selanjutnya?<div>',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: 'orange',
                        confirmButtonText: 'Lihat Data Pasien',
                        cancelButtonText: 'Tambah Data Baru',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/pendaftaran/daftar_pasien';
                        }else{
                            window.location.reload();
                        }
                    });
                }
            },
            error: function(xhr, status, error){
                createToast('Kesalahan Cek Data', 'top-right', xhr.responseJSON.message, 'error', 3000);
            }
        });
    });
});
$('#modalKonfimasiPendaftaran').on('hidden.bs.modal', function () {
    bersihkanFormulir_konfirmasi();
});
$('#select2_metode_pembayaran').on('change', function(){
    if ($('#select2_metode_pembayaran').val() == 1) {
        $('.transaksi_transfer').show();
        $('.transaksi_tunai').hide();
        nominalBayar.set(0);
        nominalKembalian.set(nominalBayarKonfirmasi.getNumber() * -1);
    }else{
        $('.transaksi_transfer').hide();
        $('.transaksi_tunai').show();
        $('#nomor_transaksi_transfer').val('');
        $('#beneficiary_bank')[0].selectedIndex = 0;
    }
});
function bersihkanFormulir_konfirmasi(){
    nominalBayar.set(0);
    nominalKembalian.set(0);
    formValidasi.removeClass('was-validated');
    $('#hutang').prop('checked', true);  
    $('#tunai').prop('checked', false);  
    $('#card-hutang').css({'border': '2px solid #ccc', 'background-color': '#f8f9fa'});
    $('#card-tunai').css({'border': '', 'background-color': ''});
    $('#select2_metode_pembayaran').val(0).trigger('change');
    $('#surat_pengantar').val('');
    $('#pembayaran_tunai').hide();
}

$("#btnIsiFormulirPakaiDataIni").on("click", function(){
    $.get('/generate-csrf-token', function(response){
        $.ajax({
            url: baseurlapi + '/pendaftaran/getdatapeserta',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token_ajax') },
            method: 'GET',
            dataType: 'json',
            data: {
                _token: response.csrf_token,
                nomor_identitas: $("#nomor_identitas_temp").html(),
            },
            success: function(response){
                if (response.rc == 200) {
                    Swal.fire({
                        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/bf2bdd2d-1dac-4285-aa3d-9548be13b15d/zzf9qF3Q23.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player>'+response.message_info+'<div>',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: 'orange',
                        confirmButtonText: 'Gunakan Data Ini',
                        cancelButtonText: 'Nanti Dulu!!',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $("#nomor_identitas").val(response.data.nomor_identitas);
                            $("#nama_peserta").val(response.data.nama_peserta);
                            $("#jenis_kelamin").val(response.data.jenis_kelamin);
                            $("#tempat_lahir").val(response.data.tempat_lahir);
                            $("#tanggal_lahir_peserta").val(moment(response.data.tanggal_lahir).format('DD-MM-YYYY'));
                            $("#alamat").val(response.data.alamat);
                            $("#no_telepon").val(response.data.no_telepon);
                            $("#email").val(response.data.email);
                            $("#jenis_kelamin").val(response.data.jenis_kelamin).trigger('change');
                            $("#status_kawin").val(response.data.status_kawin).trigger('change');
                            $("#tipe_identitas").val(response.data.tipe_identitas).trigger('change');
                        }
                    });
                }else{
                    Swal.fire({
                        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/8a0f0bc2-25f9-446a-b59c-3d8b15262c0a/kSttVfRFiv.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player>'+response.message_info+'<div>',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: 'orange',
                        confirmButtonText: 'Daftar dan Gunakan Data Ini',
                        cancelButtonText: 'Nanti Dulu!!',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $("#nomor_identitas").val(response.data.nomor_identitas);
                            $("#nama_peserta").val(response.data.nama_peserta);
                            $("#jenis_kelamin").val(response.data.jenis_kelamin);
                            $("#tempat_lahir").val(response.data.tempat_lahir);
                            $("#tanggal_lahir_peserta").val(moment(response.data.tanggal_lahir).format('DD-MM-YYYY'));
                            $("#alamat").val(response.data.alamat);
                            $("#no_telepon").val(response.data.no_telepon);
                            $("#email").val(response.data.email);
                            $("#jenis_kelamin").val(response.data.jenis_kelamin).trigger('change');
                            $("#status_kawin").val(response.data.status_kawin).trigger('change');
                            $("#tipe_identitas").val(response.data.tipe_identitas).trigger('change');
                        }
                    });
                }
            },
            error: function(xhr, status, error){
                createToast('Kesalahan Cek Data', 'top-right', xhr.responseJSON.message, 'error', 3000);
            }
        });
    });
});
$('#pencarian_member_mcu').on('select2:select', function (e) {
    let selectedData = e.params.data;
    $.get('/generate-csrf-token', function(response){
        $.ajax({
            url: baseurlapi + '/pendaftaran/getdatapeserta',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token_ajax') },
            method: 'GET',
            dataType: 'json',
            data: {
                _token: response.csrf_token,
                nomor_identitas: selectedData.id,
            },
            success: function(response){
                if (response.rc == 200) {
                    Swal.fire({
                        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/bf2bdd2d-1dac-4285-aa3d-9548be13b15d/zzf9qF3Q23.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player>'+response.message_info+'<div>',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: 'orange',
                        confirmButtonText: 'Gunakan Data Ini',
                        cancelButtonText: 'Nanti Dulu!!',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $("#nomor_identitas").val(response.data.nomor_identitas);
                            $("#nama_peserta").val(response.data.nama_peserta);
                            $("#jenis_kelamin").val(response.data.jenis_kelamin);
                            $("#tempat_lahir").val(response.data.tempat_lahir);
                            $("#tanggal_lahir_peserta").val(moment(response.data.tanggal_lahir).format('DD-MM-YYYY'));
                            $("#alamat").val(response.data.alamat);
                            $("#no_telepon").val(response.data.no_telepon);
                            $("#email").val(response.data.email);
                            $("#jenis_kelamin").val(response.data.jenis_kelamin).trigger('change');
                            $("#status_kawin").val(response.data.status_kawin).trigger('change');
                            $("#tipe_identitas").val(response.data.tipe_identitas).trigger('change');
                        }
                    });
                }
            },
            error: function(xhr, status, error){
                createToast('Kesalahan Cek Data', 'top-right', xhr.responseJSON.message, 'error', 3000);
            }
        });
    });
});