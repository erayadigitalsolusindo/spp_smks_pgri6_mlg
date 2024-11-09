let formValidasi = $("#formulir_tambah_departemen_peserta_baru");let isedit = false;let id_departemen_peserta = "";
$(document).ready(function(){
    listDepartemenPeserta();
});
function listDepartemenPeserta(){
    $.get('/generate-csrf-token', function(response){
        $("#datatable_departemenpeserta").DataTable({
            dom: 'lfrtip',
            searching: false,
            lengthChange: false,
            ordering: false,
            language: {
                "paginate": {
                    "first": '<i class="fa fa-angle-double-left"></i>',
                    "last": '<i class="fa fa-angle-double-right"></i>',
                    "next": '<i class="fa fa-angle-right"></i>',
                    "previous": '<i class="fa fa-angle-left"></i>',
                },
            },
            scrollCollapse: true,
            scrollX: true,
            bFilter: false,
            bInfo: true,
            ordering: false,
            bPaginate: true,
            bProcessing: true,
            serverSide: true,
            ajax: {
                "url": baseurlapi + '/masterdata/daftardepartemenpeserta',
                "type": "GET",
                "beforeSend": function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                },
                "data": function(d) {
                    d._token = response.csrf_token;
                    d.parameter_pencarian = $("#kotak_pencarian_departemen_peserta").val();
                },
                "dataSrc": function(json) {
                    let detailData = json.data;
                    let mergedData = detailData.map(item => {
                        return {
                            ...item,
                            recordsFiltered: json.recordsFiltered,
                        };
                    });
                    return mergedData;
                },
            },
            infoCallback: function(settings) {
                if (typeof settings.json !== "undefined") {
                    const currentPage = Math.floor(settings._iDisplayStart / settings._iDisplayLength) + 1;
                    const recordsFiltered = settings.json.recordsFiltered;
                    const infoString = 'Halaman ke: ' + currentPage + ' Ditampilkan: ' + 10 + ' Jumlah Data: ' + recordsFiltered + ' data';
                    return infoString;
                }
            },
            pagingType: "full_numbers",
            columnDefs: [{
                defaultContent: "-",
                targets: "_all"
            }],
            columns: [
                {
                    title: "No",
                    render: function(data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {
                    title: "Kode Departemen Peserta",
                    data: 'kode_departemen'
                },
                {
                    title: "Nama Departemen Peserta",
                    data: 'nama_departemen'
                },
                {
                    title: "Keterangan",
                    data: 'keterangan'
                },
                {
                    title: "Aksi",
                    render: function(data, type, row, meta) {
                        return "<div class=\"d-flex justify-content-between gap-2\"><button class=\"btn btn-primary w-100\" onclick=\"editdepartemenpeserta('" + row.id + "','" + row.kode_departemen + "','" + row.nama_departemen + "','" + row.keterangan + "')\"><i class=\"fa fa-edit\"></i> Edit Departemen Peserta</button><button class=\"btn btn-danger w-100\" onclick=\"hapusdepartemenpeserta('" + row.id + "','" + row.kode_departemen + "','" + row.nama_departemen + "')\"><i class=\"fa fa-trash-o\"></i> Hapus Departemen Peserta</button></div>";
                    }
                },
            ],
        });
    });
}
$("#tambah_departemen_peserta_baru").click(function(){
    isedit = false;
    clearFormulirTambahDepartemenPeserta();
    $("#formulir_tambah_departemen_peserta").modal("show");
});
$("#simpan_departemen_peserta").click(function(event){
    event.preventDefault();
    formValidasi.addClass('was-validated');
    if($("#kodedepartemen").val() == "" || $("#namadepartemen").val() == "" || $("#keterangan").val() == ""){
        return createToast('Kesalahan Formulir', 'top-right', 'Silahkan isi semua formulir terlebih dahulu sebelum anda menyimpan data departemen peserta secara teliti.', 'error', 3000);
    }
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53c357e2-68f2-4954-abff-939a52e6a61a/PB4F7KPq65.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Penyimpanan Data Departemen Peserta</h4><p class="text-muted mx-4 mb-0">Apakah anda yakin ingin menyimpan informasi departemen peserta <strong>'+$("#namadepartemen").val()+'</strong> ?. Jika sudah silahkan tentukan keterangan dari departemen peserta tersebut',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Simpan Data',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    url: baseurlapi + '/masterdata/' + (isedit ? 'ubahdepartemenpeserta' : 'simpandepartemenpeserta'),
                    type: 'POST',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        id: id_departemen_peserta,
                        kode_departemen: $("#kodedepartemen").val(),
                        nama_departemen: $("#namadepartemen").val(),
                        keterangan: $("#keterangan").val(),
                    },
                    success: function(response) {
                        clearFormulirTambahDepartemenPeserta();
                        $("#datatable_departemenpeserta").DataTable().ajax.reload();
                        $("#formulir_tambah_departemen_peserta").modal("hide");
                        return createToast('Berhasil', 'top-right', response.message, 'success', 3000);
                    },
                    error: function(xhr) {
                        return createToast('Gagal', 'top-right', xhr.responseJSON.message, 'error', 3000);
                    }
                });
            });
        }
    });
});
function clearFormulirTambahDepartemenPeserta(){
    isedit = false;
    formValidasi.removeClass('was-validated');
    id_departemen_peserta = "";
    $("#kodedepartemen").val("");
    $("#namadepartemen").val("");
    $("#keterangan").val("");
}
function editdepartemenpeserta(id, kode, nama, keterangan){
    isedit = true;
    id_departemen_peserta = id;
    $("#kodedepartemen").val(kode);
    $("#namadepartemen").val(nama);
    $("#keterangan").val(keterangan);
    $("#formulir_tambah_departemen_peserta").modal("show");
}
function hapusdepartemenpeserta(id, kode, nama){
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53a48ece-27d3-4b85-9150-8005e7c27aa4/usrEqiqrei.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Penghapusan Data Departemen Peserta <strong>'+nama+'</strong></h4><p class="text-muted mx-4 mb-0">Informasi yang terkait dengan departemen peserta <strong>'+nama+'</strong> tidak akan hilang tetapi tidak ditampilkan...',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Hapus Data',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    url: baseurlapi + '/masterdata/hapusdepartemenpeserta',
                    type: 'GET',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: { _token: response.csrf_token, id: id },
                    success: function(response) {
                        clearFormulirTambahDepartemenPeserta();
                        $("#datatable_departemenpeserta").DataTable().ajax.reload();
                        return createToast('Berhasil', 'top-right', response.message, 'success', 3000);
                    },
                    error: function(xhr) {
                        return createToast('Gagal', 'top-right', xhr.responseJSON.message, 'error', 3000);
                    }
                });
            });
        }
    });
}