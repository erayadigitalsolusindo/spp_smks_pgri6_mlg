let formValidasi = $("#formulir_tambah_bank_baru");let isedit = false; let idbank = "";
$(document).ready(function(){
   daftarbank();
});
function daftarbank(){
    $.get('/generate-csrf-token', function(response) {
        $("#datatables_daftarbank").DataTable({
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
            fixedColumns: true,
            scrollCollapse: true,
            fixedColumns: {
                right: 1,
                left: 0
            },
            bFilter: false,
            bInfo: true,
            ordering: false,
            scrollX: true,
            bPaginate: true,
            bProcessing: true,
            serverSide: true,
            ajax: {
                "url": baseurlapi + '/masterdata/daftarbank',
                "type": "GET",
                "beforeSend": function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                },
                "data": function(d) {
                    d._token = response.csrf_token;
                    d.parameter_pencarian = $("#kotak_pencarian_daftarmembermcu").val();
                    d.start = 0;
                    d.length = 200;
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
                    data: null,
                    render: function(data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {
                    title: "Kode Bank",
                    data: "kode_bank"
                },
                {
                    title: "Nama Bank",
                    data: "nama_bank"
                },
                {
                    title: "Keterangan",
                    data: "keterangan"
                },
                {
                    title: "Aksi",
                    className: "dtfc-fixed-right_header",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return "<div class=\"d-flex justify-content-between gap-2 background_fixed_right_row\"><button class=\"btn btn-primary w-100\" onclick=\"editdaftarbank('" + row.id + "','" + row.kode_bank + "','" + row.nama_bank + "','" + row.keterangan + "')\"><i class=\"fa fa-edit\"></i> Edit Bank Penerima</button><button class=\"btn btn-danger w-100\" onclick=\"hapusdaftarbank('" + row.id + "','" + row.nama_bank + "')\"><i class=\"fa fa-trash-o\"></i> Hapus Bank Penerima</button></div>";
                        }       
                        return data;
                    }
                }
            ]
        });
    }); 
}
$("#tambah_bank_baru").on("click", function(){
    isedit = false;
    clearformeditdaftarbank();
    $("#formulir_tambah_bank").modal("show");
});
function editdaftarbank(id,kodebank,namabank,keterangan){
    isedit = true;
    idbank = id;
    $("#kodebank").val(kodebank);
    $("#namabank").val(namabank);
    $("#keteranganbank").val(keterangan);
    $("#formulir_tambah_bank").modal("show");
}
function clearformeditdaftarbank(){
    isedit = false;
    idbank = "";
    formValidasi.removeClass("was-validated");
    $("#kodebank").val("");
    $("#namabank").val("");
    $("#keteranganbank").val("");
}
$("#kotak_pencarian_bank").on("keyup", debounce(function(){
    $("#datatables_daftarbank").DataTable().ajax.reload();
}, 300));
$("#simpan_bank").on("click", function(event){
    event.preventDefault();
    formValidasi.addClass("was-validated");
    if($("#namabank").val() == "" || $("#keteranganbank").val() == "" || $("#kodebank").val() == ""){
        return createToast('Kesalahan Formulir', 'top-right', 'Silahkan isi semua formulir terlebih dahulu sebelum anda menyimpan data bank penerima', 'error', 3000);
    }
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53c357e2-68f2-4954-abff-939a52e6a61a/PB4F7KPq65.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Penyimpanan Data Bank Penerima</h4><p class="text-muted mx-4 mb-0">Apakah anda yakin ingin menyimpan informasi bank penerima <strong>'+$(namabank).val()+'</strong> ?. Jika sudah silahkan klik tombol simpan data</p></div></div>',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Simpan Data',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    url: baseurlapi + '/masterdata/'+(isedit ? 'ubahbank' : 'simpanbank'),
                    type: 'POST',
                    beforeSend: function(xhr){
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        idbank: idbank,
                        kodebank: $("#kodebank").val(),
                        namabank: $("#namabank").val(),
                        keteranganbank: $("#keteranganbank").val(),
                    },
                    success: function(response){
                        if(response.success){
                            createToast('Berhasil', 'top-right', response.message, 'success', 3000);
                            clearformeditdaftarbank();
                            $("#formulir_tambah_bank").modal("hide");
                            $("#datatables_daftarbank").DataTable().ajax.reload();
                        }
                    },
                    error: function(xhr, status, error){
                        createToast('Kesalahan', 'top-right', xhr.responseJSON.message, 'error', 3000);
                    }
                });
            });
        }
    });
});
function hapusdaftarbank(idbank,namabank){
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://cdn.lordicon.com/gsqxdxog.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Penghapusan Data Bank Penerima</h4><p class="text-muted mx-4 mb-0">Apakah anda yakin ingin menghapus informasi bank penerima <strong>'+namabank+'</strong> ?. Jika sudah silahkan klik tombol hapus data</p></div></div>',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Hapus Data',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    url: baseurlapi + '/masterdata/hapusbank',
                    type: 'GET',
                    beforeSend: function(xhr){
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        idbank: idbank,
                        namabank: namabank,
                    },
                    success: function(response){
                        if(response.success){
                            createToast('Berhasil', 'top-right', response.message, 'success', 3000);
                            clearformeditdaftarbank()
                            $("#datatables_daftarbank").DataTable().ajax.reload();
                        }
                    },
                    error: function(xhr, status, error){
                        createToast('Kesalahan', 'top-right', xhr.responseJSON.message, 'error', 3000);
                    }
                });
            });
        }
    });
}