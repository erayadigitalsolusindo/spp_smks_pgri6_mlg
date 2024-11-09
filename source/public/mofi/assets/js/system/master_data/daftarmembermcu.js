let formValidasi = $("#formulir_tambah_member_mcu_baru");let isedit = false;let idmembermcu = "";
$(document).ready(function(){
    daftarmembermcu();
    flatpickr("#tanggal_lahir", {
        dateFormat: "d-m-Y",
        maxDate: moment().subtract(15, 'years').format('DD-MM-YYYY'),
    });
});
function daftarmembermcu() {
    $.get('/generate-csrf-token', function(response) {
        $("#datatables_daftarmembermcu").DataTable({
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
                "url": baseurlapi + '/masterdata/daftarmembermcu',
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
                    title: "Nomor Identitas",
                    data: "nomor_identitas"
                },
                {
                    title: "Nama Peserta",
                    data: "nama_peserta"
                },
                {
                    title: "Tempat Lahir",
                    data: "tempat_lahir"
                },
                {
                    title: "Tanggal Lahir",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return row.tanggal_lahir.split("-").reverse().join("-") + " (" + row.umur + " Tahun)";
                        }
                        return data;
                    }
                },
                {
                    title: "Tipe Identitas", 
                    data: "tipe_identitas"
                },
                {
                    title: "Jenis Kelamin",
                    data: "jenis_kelamin"
                },
                {
                    title: "Alamat",
                    data: "alamat"
                },
                {
                    title: "Status Kawin",
                    data: "status_kawin"
                },
                {
                    title: "No Telepon",
                    data: "no_telepon"
                },
                {
                    title: "Alamat Surel",
                    data: "email"
                },
                {
                    title: "Terdaftar Pada",
                    data: "created_at"
                },
                {
                    title: "Aksi",
                    className: "dtfc-fixed-right_header",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return "<div class=\"d-flex justify-content-between gap-2 background_fixed_right_row\"><button class=\"btn btn-primary w-100\" onclick=\"editdaftarmembermcu('" + row.id + "','" + row.nomor_identitas + "','" + row.nama_peserta + "','" + row.tempat_lahir + "','" + row.tanggal_lahir + "','" + row.tipe_identitas + "','" + row.jenis_kelamin + "','" + row.alamat + "','" + row.status_kawin + "','" + row.no_telepon + "', '"+row.email+"')\"><i class=\"fa fa-edit\"></i> Edit Member MCU</button><button class=\"btn btn-danger w-100\" onclick=\"hapusdaftarmembermcu('" + row.id + "','" + row.nama_peserta + "','"+row.nomor_identitas+"')\"><i class=\"fa fa-trash-o\"></i> Hapus Member MCU</button></div>";
                        }       
                        return data;
                    }
                }
            ]
        });
    }); 
}
$("#kotak_pencarian_daftarmembermcu").on("keyup", debounce(function() {
    $("#datatables_daftarmembermcu").DataTable().ajax.reload();
}, 500));
$("#tambah_member_mcu_baru").on("click", function() {
    isedit = false;
    clearformulirtambahmembermcu();
    $("#formulir_tambah_member_mcu_baru").modal("show");
});
$("#simpan_member_mcu_baru").on("click", function(event) {
    event.preventDefault();
    formValidasi.addClass('was-validated');
    if ($("#nomor_identitas").val() == "" || $("#nama_peserta").val() == "" || $("#tempat_lahir").val() == "" || $("#tanggal_lahir").val() == "" || $("#tipe_identitas").val() == "" || $("#jenis_kelamin").val() == "" || $("#alamat").val() == "" || $("#status_kawin").val() == "" || $("#no_telepon").val() == "") {
        return createToast('Kesalahan Formulir', 'top-right', 'Silahkan isi semua formulir terlebih dahulu sebelum anda menyimpan data member MCU agar informasi tersebut dianggap benar dan akurat', 'error', 3000);
    }
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53c357e2-68f2-4954-abff-939a52e6a61a/PB4F7KPq65.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Penyimpanan Data Member MCU</h4><p class="text-muted mx-4 mb-0">Apakah anda yakin ingin menyimpan informasi member MCU <strong>'+$(nama_peserta).val()+'</strong> ?. Jika sudah silahkan tentukan paket MCU',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Simpan Data',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    url: baseurlapi + '/masterdata/'+(isedit ? 'ubahmembermcu' : 'simpanmembermcu'),
                    type: 'POST',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        id: idmembermcu,
                        nomor_identitas: $("#nomor_identitas").val(),
                        nama_peserta: $("#nama_peserta").val(),
                        tempat_lahir: $("#tempat_lahir").val(),
                        tanggal_lahir: $("#tanggal_lahir").val(),
                        tipe_identitas: $("#tipe_identitas").val(),
                        jenis_kelamin: $("#jenis_kelamin").val(),
                        alamat: $("#alamat").val(),
                        status_kawin: $("#status_kawin").val(),
                        no_telepon: $("#no_telepon").val(),
                        email: $("#email_member_mcu").val(),
                    },
                    success: function(response) {
                        clearformulirtambahmembermcu();
                        $("#datatables_daftarmembermcu").DataTable().ajax.reload();
                        createToast('Informasi Member MCU', 'top-right', response.message, 'success', 3000);
                        $("#formulir_tambah_member_mcu_baru").modal("hide");
                    },
                    error: function(xhr, status, error) {
                        createToast('Kesalahan Penyimpanan Data', 'top-right', error, 'error', 3000);
                    }
                });
            });
        }
    });
});
function clearformulirtambahmembermcu() {
    isedit = false;
    idmembermcu = "";
    formValidasi.removeClass('was-validated');
    const fields = ['nomor_identitas', 'nama_peserta', 'tempat_lahir', 'tanggal_lahir', 'alamat', 'no_telepon'];
    fields.forEach(field => $(`#${field}`).val(''));
    $("#status_kawin").val("Belum Menikah");
    $("#jenis_kelamin").val("Laki-Laki");
    $("#tipe_identitas").val("KTP");
}
function hapusdaftarmembermcu(idmembermcu,nama_peserta,nomor_identitas) {
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53a48ece-27d3-4b85-9150-8005e7c27aa4/usrEqiqrei.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Penghapusan Data Member '+nama_peserta+'</h4><p class="text-muted mx-4 mb-0">Apakah anda yakin ingin menghapus informasi member MCU <strong>'+nama_peserta+'</strong> dengan ID <strong>'+nomor_identitas+'</strong> ? Data tidak akan dihapus dari sistem tetapi informasi tidak ditampilkan ke aplikasi terhadap yang terhubung dengan member ini',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Hapus Data',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    url: baseurlapi + '/masterdata/hapusmembermcu',
                    type: 'GET',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        id: idmembermcu,
                        nama_peserta: nama_peserta,
                    },
                    success: function(response) {
                        clearformulirtambahmembermcu()
                        $("#datatables_daftarmembermcu").DataTable().ajax.reload();
                        createToast('Informasi Member MCU', 'top-right', response.message, 'success', 3000);
                    },
                    error: function(xhr, status, error) {
                        createToast('Kesalahan Penghapusan Data', 'top-right', error, 'error', 3000);
                    }
                });
            });
        }
    });
}
function editdaftarmembermcu(id,nomor_identitas,nama_peserta,tempat_lahir,tanggal_lahir,tipe_identitas,jenis_kelamin,alamat,status_kawin,no_telepon,email) {
    isedit = true;
    idmembermcu = id;
    const fields = {
        'nomor_identitas': nomor_identitas,
        'nama_peserta': nama_peserta, 
        'tempat_lahir': tempat_lahir,
        'tanggal_lahir': tanggal_lahir.split("-").reverse().join("-"),
        'tipe_identitas': tipe_identitas,
        'jenis_kelamin': jenis_kelamin,
        'alamat': alamat,
        'status_kawin': status_kawin,
        'no_telepon': no_telepon,
        'email': email,
    };

    Object.entries(fields).forEach(([id, value]) => {
        $(`#${id}`).val(value);
    });
    $("#formulir_tambah_member_mcu_baru").modal("show");
}