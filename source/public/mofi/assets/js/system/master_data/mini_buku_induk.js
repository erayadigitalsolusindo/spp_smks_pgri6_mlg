let isedit = false;
$(document).ready(function() {
    onloaddatatable();
});
function onloaddatatable() {
    $.get('/generate-csrf-token', function(response) {
        $("#datatables_mini_buku_induk").DataTable({
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
                "url": baseurlapi + '/masterdata/daftarsiswa',
                "type": "GET",
                "beforeSend": function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                },
                "data": function(d) {
                    d._token = response.csrf_token;
                    d.parameter_pencarian = $("#kotak_pencarian_mini_buku_induk").val();
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
                    title: "NIS / NISN",
                    render: function(data, type, row, meta) {
                        return row.nis + ' / ' + row.nisn;
                    }
                },
                {
                    title: "Nama Siswa",
                    render: function(data, type, row, meta) {
                        return `Nama : ${row.nama_siswa} <br> Kelas : ${row.tingkat_kelas}`;
                    }
                },
                {
                    title: "Informasi Siswa",
                    render: function(data, type, row, meta) {
                        return `Alamat : ${row.alamat_siswa} <br> Jenis Kelamin : ${row.jenis_kelamin == 'L' ? 'Laki-laki' : 'Perempuan'} <br> No Telepon : ${row.no_telepon == null ? 'Tidak Ada' : row.no_telepon}`;
                    }
                },
                {
                    title: "Aksi",
                    className: "dtfc-fixed-right_header",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return "<div class=\"d-flex justify-content-between gap-2 background_fixed_right_row\"><button onclick=\"editinformasisiswa('" + row.id_siswa + "')\" class=\"btn btn-primary w-100\"><i class=\"fa fa-edit\"></i></button><button onclick=\"hapusinformasisiswa('" + row.id_siswa + "','"+row.nis+"','"+row.nama_siswa+"')\" class=\"btn btn-danger w-100\"><i class=\"fa fa-trash-o\"></i></button></div>";
                        }       
                        return data;
                    }
                }
            ]
        });
    }); 
}
$("#kotak_pencarian_mini_buku_induk").on("keyup change", debounce(function() {
    $("#datatables_mini_buku_induk").DataTable().ajax.reload();
}, 300));
$("#tambah_informasi_siswa").on("click", function() {
    $("#formulir_tambah_informasi_siswa").modal("show");
});
function simpandatabukuinduk(){
    if ($("#nis").val() == "" || $("#nama_siswa").val() == "" || $("#kelas").val() == "" || $("#tahun_ajaran").val() == "" || $("#jenis_kelamin").val() == "") {
        createToast('Kesalahan', 'top-right', 'Mohon lengkapi data yang diperlukan. NIS, Nama Siswa, Kelas, Tahun Ajaran, dan Jenis Kelamin harus diisi dalam formulir tambah informasi siswa', 'error', 3000);
    }
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53c357e2-68f2-4954-abff-939a52e6a61a/PB4F7KPq65.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Simpam Informasi Siwa</h4><p class="text-muted mx-4 mb-0">Infomrasi siswa akan ditambahkan ke dalam sistem Aplikasi pembayaran SPP SMK PGRI 6 Malang. Silahakan tentukan tagihan untuk siswa tersebut sebelum melakuka transaksi pembayaran atas siswa ini</p></div></div>',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Simpan Data',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    url: baseurlapi + '/masterdata/simpaninformasisiswa',
                    type: 'POST',
                    beforeSend: function(xhr){
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        isedit: isedit,
                        id: $("#id_siswa").val(),
                        nis: $("#nis").val(),
                        nisn: $("#nisn").val(),
                        nama_siswa: $("#nama_siswa").val(),
                        alamat_siswa: $("#alamat_siswa").val(),
                        no_telepon: $("#no_telepon").val(),
                        email: $("#email").val(),
                        kelas: $("#id_kelas").val(),
                        tahun_ajaran: $("#id_tahun_ajaran").val(),
                        jenis_kelamin: $("#jenis_kelamin").val(),
                    },
                    success: function(response){
                        if(response.success){
                            isedit = false;
                            createToast('Berhasil', 'top-right', response.message, 'success', 3000);
                            clearformtambahinformasisiswa();
                            $("#formulir_tambah_informasi_siswa").modal("hide");
                            setTimeout(function() {
                                $("#datatables_mini_buku_induk").DataTable().ajax.reload();
                            }, 1000);
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
$("#simpan_data_tambah_informasi_siswa").on("click", function() {
    simpandatabukuinduk()
});
function clearformtambahinformasisiswa() {
    $("#id_siswa").val("");
    $("#nis").val("");
    $("#nisn").val("");
    $("#alamat_siswa").val("");
    $("#no_telepon").val("");
    $("#email").val("");
    $("#nama_siswa").val("");
    $("#kelas").val("");
    $("#tahun_ajaran").val("");
    $("#jenis_kelamin").val("");
}
function hapusinformasisiswa(id,nis,nama_siswa) {
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53c357e2-68f2-4954-abff-939a52e6a61a/PB4F7KPq65.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Penghapusan Data Siswa</h4><p class="text-muted mx-4 mb-0">Apakah anda yakin ingin menghapus data siswa <strong>'+nama_siswa+' dengan NIS '+nis+'. Informasi mengenai siswa ini akan dihapus dari sistem Aplikasi pembayaran SPP SMK PGRI 6 Malang tetapi semua transaksi tidak dihapus tetapi tidak bisa ditampilkan secara visual</strong> ?. Jika sudah silahkan klik tombol hapus data</p></div></div>',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Hapus Data',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    url: baseurlapi + '/masterdata/hapusinformasisiswa',
                    type: 'GET',
                    beforeSend: function(xhr){
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        id: id,
                        nis: nis,
                        nama_siswa: nama_siswa,
                    },
                    success: function(response){
                        if(response.success){
                            isedit = false;
                            createToast('Berhasil', 'top-right', response.message, 'success', 3000);
                            $("#datatables_mini_buku_induk").DataTable().ajax.reload();
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
function editinformasisiswa(id) {
    $.get('/generate-csrf-token', function(response){
        $.ajax({
            url: baseurlapi + '/masterdata/getinformasisiswa',
            type: 'GET',
            beforeSend: function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
            },
            data: {
                _token: response.csrf_token,
                id: id,
            },
            success: function(response){
                isedit = true;
                $("#id_siswa").val(id);
                $("#nis").val(response.data.nis);
                $("#nisn").val(response.data.nisn);
                $("#nama_siswa").val(response.data.nama_siswa);
                $("#alamat_siswa").val(response.data.alamat_siswa);
                $("#no_telepon").val(response.data.no_telepon);
                $("#email").val(response.data.email);
                $("#id_kelas").val(response.data.id_kelas);
                $("#id_tahun_ajaran").val(response.data.id_tahun_ajaran);
                $("#jenis_kelamin").val(response.data.jenis_kelamin);
                $("#formulir_tambah_informasi_siswa").modal("show");
            },
            error: function(xhr, status, error){
                createToast('Kesalahan', 'top-right', xhr.responseJSON.message, 'error', 3000);
            }
        });
    });
}