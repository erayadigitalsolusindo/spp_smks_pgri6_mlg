let kuantiti = new AutoNumeric('#kuantiti', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0',});
let sisa_nominal = new AutoNumeric('#sisa_nominal', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0',});
let nominal = new AutoNumeric('#nominal', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0',});

$(document).ready(function() {
    setTimeout(function() {
        tabel_datatagihan();
    }, 500);
});
function tabel_datatagihan() {
    $.get('/generate-csrf-token', function(response) {
        $("#datatables_tagihan").DataTable({
            dom: 'lfrtip',
            searching: false,
            lengthChange: false,
            ordering: false,
            pagingType: "full_numbers",
            language: {
                paginate: {
                    first: '<i class="fa fa-angle-double-left"></i>',
                    last: '<i class="fa fa-angle-double-right"></i>',
                    next: '<i class="fa fa-angle-right"></i>',
                    previous: '<i class="fa fa-angle-left"></i>',
                }
            },
            scrollX: true,
            serverSide: true,
            ajax: {
                url: baseurlapi + '/spp/daftar_tagihan_non_bulanan',
                type: "GET",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                },
                data: function(d) {
                    d._token = response.csrf_token;
                    d.kelas_terpilih = $("#filter_tingkat_kelas_tagihan").val();
                    d.parameter_pencarian = $("#kotak_pencarian_tagihan").val();
                    d.tahun_ajaran_terpilih = $("#filter_tahun_ajaran_tagihan").val();
                    d.jenis_tagihan_terpilih = $("#filter_jenis_tagihan").val();
                }
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
                { title: "No", className: "text-center", render: (data, type, row, meta) => meta.row + meta.settings._iDisplayStart + 1 },
                { title: "NIS", className: "text-center", data: "nis" },
                { title: "Nama Siswa", className: "text-center", data: "nama_siswa" },
                { title: "Jenis Tagihan", className: "text-center",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return `${row.jenis_transaksi} (${row.qty} kali)`;
                        }
                        return data;
                    }
                },
                { title: "Sisa Tagihan",
                     className: "text-end", 
                     render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return `${new Intl.NumberFormat('id-ID').format(row.sisa_nominal)}`;
                        }
                        return data;
                    }
                },
                { title: "Tagihan",
                    className: "text-end", 
                    render: function(data, type, row, meta) {
                       if (type === 'display') {
                           return `${new Intl.NumberFormat('id-ID').format(row.nominal)}`;
                       }
                       return data;
                   }
               },
                { 
                    title: "Aksi", 
                    className: "dtfc-fixed-right_header text-center", 
                    render: (data, type, row) => `
                        <div class="d-flex justify-content-between gap-2 background_fixed_right_row">
                            <button class="btn btn-primary w-100" onclick="editdaftartagihan('${row.id_siswa}','${row.kode_jenis_transaksi}','${row.id_tahun_ajaran}')">
                                <i class="fa fa-edit"></i></button>
                            <button class="btn btn-danger w-100" onclick="hapustagihanpeserta('${row.id_siswa}', '${row.nama_siswa}','${row.kode_jenis_transaksi}','${row.id_tahun_ajaran}')">
                                <i class="fa fa-trash-o"></i></button>
                        </div>`
                }
            ]
        });
    });
}
$("#proses_tagihan").on("click", function() {
    $("#datatables_tagihan").DataTable().ajax.reload();
});
$("#kotak_pencarian_tagihan").on("keyup change", debounce(function() {
   $("#datatables_tagihan").DataTable().ajax.reload();
}, 500));
function hapustagihanpeserta(id_siswa, nama_siswa, kode_jenis_transaksi, id_tahun_ajaran){
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53a48ece-27d3-4b85-9150-8005e7c27aa4/usrEqiqrei.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Penghapusan Data Tegihan '+nama_siswa+'</h4><p class="text-muted mx-4 mb-0">Apakah anda yakin ingin menghapus informasi tagihan peserta <strong>'+nama_siswa+'</strong> dengan ID <strong>'+id_siswa+'</strong> ? Informasi peserta yang terkait dengan siswa yang dihapus tidak akan hilang, tetapi tidak akan dimunculin secara visual pada aplikasi ini termasuk LAPORAN',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Hapus Data',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    url: baseurlapi + '/masterdata/hapustagihanpeserta_non_bulanan',
                    type: 'GET',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        id_siswa: id_siswa,
                        nama_siswa: nama_siswa,
                        kode_jenis_transaksi: kode_jenis_transaksi,
                        id_tahun_ajaran: id_tahun_ajaran
                    },
                    success: function(response) {
                        $("#datatables_tagihan").DataTable().ajax.reload();
                        createToast('Informasi Peserta', 'top-right', response.message, 'success', 3000);
                    },
                    error: function(xhr, status, error) {
                        createToast('Kesalahan Penghapusan Data', 'top-right', error, 'error', 3000);
                    }
                });
            });
        }
    });
}
function editdaftartagihan(id_siswa, kode_jenis_transaksi, id_tahun_ajaran){
    $.get('/generate-csrf-token', function(response){
        $.ajax({
            url: baseurlapi + '/spp/editdaftartagihan_non_bulanan',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
            },
            data: {
                _token: response.csrf_token,
                id_siswa: id_siswa,
                kode_jenis_transaksi: kode_jenis_transaksi,
                id_tahun_ajaran: id_tahun_ajaran
            },
            success: function(response) {
                $("#nama_siswa_tagihan").html(response.data.nama_siswa);
                $("#id_siswa_tagihan").html(response.data.id);
                kuantiti.set(response.data.qty);
                sisa_nominal.set(response.data.sisa_nominal)
                nominal.set(response.data.nominal);
                $("#tahunajaran").val(response.data.id_tahun_ajaran)
                $("#kode_jenis_transaksi").val(response.data.kode_jenis_transaksi)
                $("#form_edit_tagihan").modal("show");
                $("#datatables_tagihan").DataTable().ajax.reload();
            },
            error: function(xhr, status, error) {
                createToast('Kesalahan Edit Data', 'top-right', error, 'error', 3000);
            }
        });
    });

}
function simpan_tagihan_siswa_update(){
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53c357e2-68f2-4954-abff-939a52e6a61a/PB4F7KPq65.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Pembaruan Tagihan</h4><p class="text-muted mx-4 mb-0">Tagihan atas Nama Siswa <strong>'+$("#nama_siswa_tagihan").html()+'</strong> dengan NIS <strong>'+$("#nomor_induk_siswa_tagihan").html()+'</strong> akan diperbarui dengan data tagihan sebagai daftar pada formulir. Apakah anda yakin ingin melanjutkan proses pembaruan tagihan ini?</p></div>',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Pembaruan Sekarang',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    url: baseurlapi + '/spp/updatetagihan_non_bulanan',
                    type: 'POST',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        id_siswa: $("#id_siswa_tagihan").html(),
                        kode_jenis_transaksi: $("#kode_jenis_transaksi").val(),
                        qty: kuantiti.getNumber(),
                        sisa_nominal: sisa_nominal.getNumber(),
                        nominal: nominal.getNumber(),
                        id_tahun_ajaran: $("#tahunajaran").val(),
                    },
                    success: function(response) {
                        createToast('Informasi', 'top-right', response.message, 'success', 3000);
                        $("#datatables_tagihan").DataTable().ajax.reload();
                        $("#form_edit_tagihan").modal("hide");
                    },
                    error: function(xhr, status, error) {
                        createToast('Kesalahan Pembaruan Tagihan', 'top-right', error, 'error', 3000);
                    }
                });
            });
        }
    });
}   