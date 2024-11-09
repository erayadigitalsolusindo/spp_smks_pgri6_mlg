$(document).ready(function () {
    tabel_hakakses();
});
$('#kotak_pencarian').on('input', debounce(function() {
    $("#datatables_permission").DataTable().ajax.reload();
}, 500));
function tabel_hakakses(){
$.get('/generate-csrf-token', function(response) {
    $("#datatables_permission").DataTable({
        dom: 'lfrtip',
        searching: false,
        lengthChange: false,
        ordering: false,
        language:{
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
        bInfo : true,
        ordering: false,
        bPaginate: true,
        bProcessing: true, 
        serverSide: true,
        ajax: {
            "url": baseurlapi + '/permission/daftarhakakses',
            "type": "GET",
            "beforeSend": function (xhr) { xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));},
            "data": function (d) {
                d._token = response.csrf_token;
                d.parameter_pencarian = $('#kotak_pencarian').val();
                d.start = 0;
                d.length = 10;
            },
            "dataSrc": function (json) {
                let detailData = json.data;
                let mergedData = detailData.map(item => {
                    return {
                        ...item,
                        recordsFiltered: json.recordsFiltered,
                    };
                });
                return mergedData;
            }
        },
        infoCallback: function (settings) {
            if (typeof settings.json !== "undefined"){
                const currentPage = Math.floor(settings._iDisplayStart / settings._iDisplayLength) + 1;
                const recordsFiltered = settings.json.recordsFiltered;
                const infoString = 'Halaman ke: ' + currentPage + ' Ditampilkan: ' + 10 + ' Jumlah Data: ' + recordsFiltered+ ' data';
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
                    if (type === 'display') {
                        return meta.row + 1 + meta.settings._iDisplayStart;
                    }
                    return data;
                }
            },
            {
                title: "Nama Perizinan",
                render: function(data, type, row, meta) {
                    if (type === 'display') {
                        return row.name;
                    }
                    return data;
                }
            },
            {
                title: "Group Izin",
                render: function(data, type, row, meta) {
                    if (type === 'display') {
                        return row.group;
                    }
                    return data;
                }
            }, 
            {
                title: "Keterangan",
                render: function(data, type, row, meta) {
                    if (type === 'display') {
                        return row.description;
                    }
                    return data;
                } 
            },
            {
                title: "Aksi",
                render: function(data, type, row, meta) {
                    if (type === 'display') {
                        return "<div class=\"d-flex justify-content-between gap-2\"><button class=\"btn btn-primary w-100\" onclick=\"edithakakses('" + row.id + "','" + row.name + "', '" + row.description + "','"+ row.group+"')\"><i class=\"fa fa-edit\"></i> Edit Izin</button><button class=\"btn btn-danger w-100\" onclick=\"hapushakakses('" + row.id + "','" + row.name + "')\"><i class=\"fa fa-trash-o\"></i> Hapus Izin</button></div>";
                    }
                    return data;
                }
            },
        ],
    });
});
}
function edithakakses(idhakakses,namahakakses,keteranganhakakses,nama_group){
    $('#idhakakses').val(idhakakses);
    $('#namahakakses').val(namahakakses);
    $('#keteranganhakakses').val(keteranganhakakses);
    $('#nama_group').val(nama_group);
    $('#editRoleModal').modal('show');
}
$("#simpan_hakakses").click(function(){  
if ($("#nama_hakakses").val() == "" || $("#keterangan").val() == "") {
    return createToast('Kesalahan Formulir','top-right', 'Nama Hak Izin dan Keterangan tidak boleh kosong. Silahkan isi terlebih dahulu. Contoh : Akses TreadMill, Akses Pendaftaran, Akses Perawatan, Dll', 'error', 3000);
}  
$("#simpan_hakakses").html('Proses Simpan...<i class="fa fa-spin fa-spinner"></i>');
Swal.fire({
    title: "Simpan Hak Izin <strong>" + $("#nama_hakakses").val() + "</strong>?",
    text: "Pastikan anda memasukkan izin aplikasi yang benar sesuai dengan kebutuhan sistem anda. Diskusikan dengan Programmer untuk menentukan izin aplikasi yang tepat. jika anda sudah mengeerti dengan core sistem maka anda dapat menambahkan izin aplikasi sesuai kebutuhan sistem anda.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Simpan!",
    cancelButtonText: "Batal"
}).then((result) => {
    if (result.isConfirmed) {
    $.ajax({
        url: baseurlapi + '/permission/tambahhakakses',
        type: "POST",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'Authorization': 'Bearer ' + localStorage.getItem('token_ajax')
        },
        data: {
            nama_hakakses: $("#nama_hakakses").val(),
            keterangan: $("#keterangan").val(),
            namagroup: $("#nama_group").val(),
        },
        success: function(response){
            createToast('Sukses Eksekusi Proses','top-right', response.message, 'success', 3000);
            $("#nama_hakakses").val("");
            $("#keterangan").val("");
            $("#nama_group").val("");
            $("#datatables_permission").DataTable().ajax.reload();
            $("#simpan_hakakses").html('Simpan Data');
        },
        error: function(xhr, status, error) {
            createToast('Gagal Eksekusi Proses','top-right', "Pesan Kesalahan : "+xhr.responseJSON.message, 'error', 3000);
            $("#simpan_hakakses").html('Simpan Data');
        }
    });
    }else{
    $("#simpan_hakakses").html('Simpan Data');
    }
});
});
$("#update_hakakses").click(function(){
if ($("#namahakakses").val() == "" || $("#keteranganhakakses").val() == "") {
    return createToast('Kesalahan Formulir','top-right', 'Nama Hak Akses dan Keterangan tidak boleh kosong. Silahkan isi terlebih dahulu. Contoh : Threadmill, Perawatan, Dll', 'error', 3000);
} 
$("#update_hakakses").html('Proses Simpan...<i class="fa fa-spin fa-spinner"></i>');
Swal.fire({
    title: "Simpan Hak Akses <strong>" + $("#namahakakses").val() + "</strong>?",
    text: "Apakah anda yakin ingin mengubah data hak akses ini? Perubahan informasi ini tidak berpengaruh pada pengguna yang sudah memiliki hak akses ini, karena hanya merubah identitas hak akses saja.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Simpan!",
    cancelButtonText: "Batal"
}).then((result) => {
    if (result.isConfirmed) {
    $.ajax({
        url: baseurlapi + '/permission/edithakakses',
        type: "POST",
        headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        'Authorization': 'Bearer ' + localStorage.getItem('token_ajax')
        }, 
        data: {
        idhakakses: $("#idhakakses").val(),
        namahakakses: $("#namahakakses").val(),
        keteranganhakakses: $("#keteranganhakakses").val()
        },
        success: function(response){
        createToast('Sukses Eksekusi Proses','top-right', response.message, 'success', 3000);
        $("#datatables_permission").DataTable().ajax.reload();
        $("#editRoleModal").modal('hide');
        $("#update_hakakses").html('Simpan Data');
        },
        error: function(xhr, status, error) {
        createToast('Gagal Eksekusi Proses','top-right', "Pesan Kesalahan : "+xhr.responseJSON.message, 'error', 3000);
        $("#update_hakakses").html('Simpan Data');
        }
    });
    }
});
});
function hapushakakses(idhakakses,namahakakses){
if (idhakakses == "") {
    return createToast('Kesalahan Formulir','top-right', 'Silahkan tentukan ID Hak akss untuk melakukan penghapusan hak akases', 'error', 3000);
}  
Swal.fire({
    html: '<div class="mt-3"><lord-icon src="https://cdn.lordicon.com/gsqxdxog.json" trigger="loop" colors="primary:#f06548,secondary:#f7b84b" style="width:120px;height:120px"></lord-icon><div class="pt-2 fs-15"><h4>Konfirmasi Hapus Hak Akses '+namahakakses+'</h4><p class="text-muted mx-4 mb-0">Seluruh izin akses atas hak akses ini akan dihapus dan pengguna dengan hak akses ini akakn diubah menjadi NON AKTIF saat pengguna melakukan masuk ulang ke sistem</p></div></div>',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: 'orange',
    confirmButtonText: 'Hapus Informasi',
    cancelButtonText: 'Nanti Dulu!!',
}).then((result) => {
    if (result.isConfirmed) {
    $.ajax({
        url: baseurlapi + '/permission/hapushakakses',
        type: "GET",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'Authorization': 'Bearer ' + localStorage.getItem('token_ajax')
        },
        data: {
            idhakakses: idhakakses,
            namahakakses: namahakakses
        },
        success: function(response){
            createToast('Sukses Eksekusi Proses','top-right', response.message, 'success', 3000);
            $("#datatables_permission").DataTable().ajax.reload();
        },
        error: function(xhr, status, error) {
            createToast('Gagal Eksekusi Proses','top-right', "Pesan Kesalahan : "+xhr.responseJSON.message, 'error', 3000);
        }
    });
    }
});
}