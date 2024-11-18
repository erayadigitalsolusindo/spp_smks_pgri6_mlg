$(document).ready(function(){
    getjenispembayaran();
});
function getjenispembayaran(){
    $.get('/generate-csrf-token', function(response) {
        $("#datatables_jenis_pembayaran").DataTable({
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
                "url": baseurlapi + '/masterdata/jenispembayarantabel',
                "type": "GET",
                "beforeSend": function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                },
                "data": function(d) {
                    d._token = response.csrf_token;
                    d.parameter_pencarian = $("#kotak_pencarian_jenis_pembayaran").val();
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
                    title: "Kode Jenis Pembayaran",
                    render: function(data, type, row, meta) {
                        return row.kode;
                    }
                },
                {
                    title: "Nama Jenis Pembayaran",
                    render: function(data, type, row, meta) {
                        return row.jenis_transaksi;
                    }
                },
                {
                    title: "Aksi",
                    className: "dtfc-fixed-right_header",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return "<div class=\"d-flex justify-content-between gap-2 background_fixed_right_row\"><button onclick=\"editinformasisiswa('" + row.kode + "','"+row.jenis_transaksi+"')\" class=\"btn btn-primary w-100\"><i class=\"fa fa-edit\"></i></button><button onclick=\"hapusjenispembayaran('"+row.kode+"','"+row.jenis_transaksi+"')\" class=\"btn btn-danger w-100\"><i class=\"fa fa-trash-o\"></i></button></div>";
                        }       
                        return data;
                    }
                }
            ]
        });
    });
}

$("#kotak_pencarian_jenis_pembayaran").on("keyup change", debounce(function(){
    $("#datatables_jenis_pembayaran").DataTable().ajax.reload();
}, 300));
$("#tombol_tambah_jenis_pembayaran").on("click", function(){
    $("#formulir_tambah_informasi_siswa").modal("show");
});
$("#simpan_data_tambah_informasi_siswa").on("click", function(){
    if ($("#kode").val() == "" || $("#jenis_transaksi").val() == "") {
        return createToast('Kesalahan', 'top-right', 'Mohon lengkapi data yang diperlukan. Kode Jenis Pembayaran dan Nama Jenis Pembayaran harus diisi dalam formulir tambah jenis pembayaran', 'error', 3000);
    }
    $.get('/generate-csrf-token', function(response) {
        $.ajax({
            url: baseurlapi + '/masterdata/tambahjenispembayaran',
            type: 'POST',
            beforeSend: function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
            },  
            data: {
                _token: response.csrf_token,
                kode: $("#kode").val(),
                jenis_transaksi: $("#jenis_transaksi").val(),
            },
            success: function(response){
                createToast('Berhasil', 'top-right', response.message, 'success', 3000);
                clearformulir()
                $("#formulir_tambah_informasi_siswa").modal("hide");
                $("#datatables_jenis_pembayaran").DataTable().ajax.reload();
            },
            error: function(xhr, status, error){
                createToast('Kesalahan', 'top-right', 'Gagal menambahkan jenis pembayaran. Silakan coba lagi.', 'error', 3000);
            }
        });
    });
});
function hapusjenispembayaran(kode_jenis_transaksi,nama_jenis_transaksi){
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53c357e2-68f2-4954-abff-939a52e6a61a/PB4F7KPq65.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Hapus Jenis Pembayaran</h4><p class="text-muted mx-4 mb-0">Usahakan jika jenis pembayaran sudah digunakan, maka tidak boleh dihapus. Jika terhapus maka informasi mengenai transaksi berdasarkan jenis pembayaran ini tidak dapat dimunculkan secara visual.</p></div></div>',  
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Hapus Data',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response) {
                $.ajax({
                    url: baseurlapi + '/masterdata/hapusjenispembayaran',
                    type: 'GET',
                    beforeSend: function(xhr){
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        kode_jenis_transaksi: kode_jenis_transaksi,
                        nama_jenis_transaksi: nama_jenis_transaksi,
                    },
                    success: function(response){
                        createToast('Berhasil', 'top-right', response.message, 'success', 3000);
                        clearformulir()
                        $("#datatables_jenis_pembayaran").DataTable().ajax.reload();
                    },
                    error: function(xhr, status, error){
                        createToast('Kesalahan', 'top-right', 'Gagal menghapus jenis pembayaran. Silakan coba lagi.', 'error', 3000);
                    }   
                });
            });
        }
    });
}
function editinformasisiswa(kode,jenis_transaksi){
    $("#kode").val(kode);
    $("#jenis_transaksi").val(jenis_transaksi);
    $("#formulir_tambah_informasi_siswa").modal("show");
}
function clearformulir(){
    $("#kode").val("");
    $("#jenis_transaksi").val("");
}