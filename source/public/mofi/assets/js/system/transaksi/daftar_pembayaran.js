$(document).ready(function() {
    datatables_daftar_pembayaran();
});
function datatables_daftar_pembayaran() {
    $.get('/generate-csrf-token', function(response) {
        $("#datatables_daftar_pembayaran").DataTable({
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
                "url": baseurlapi + '/spp/daftar_pembayaran',
                "type": "GET",
                "beforeSend": function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                },
                "data": function(d) {
                    d._token = response.csrf_token;
                    d.parameter_pencarian = $("#kotak_pencarian_daftarpasien").val();
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
                    title: "No. Transaksi",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return `<a href="javascript:void(0)" onclick="lihatDetailTransaksi('${row.id_transaksi}')" style="color: red;">${row.no_transaksi}</a>`;
                        }
                        return data;
                    }
                },
                {
                    title: "Informasi Siswa",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return `NIS: ${row.nis_siswa}<br>Nama Siswa: ${row.nama_siswa}<br>Kelas: ${row.tingkat_kelas}`;
                        }
                        return data;
                    }
                },
                {
                    title: "Tanggal",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return `${row.tanggal_transaksi}`;
                        }
                        return data;
                    }
                },
                {
                    title: "Nominal",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return `Rp. ${new Intl.NumberFormat('id-ID').format(row.total_nominal)}<br>(${row.total_trx} Trx)`;
                        }
                        return data;
                    }
                },
                {
                    title: "Petugas",
                    data: "nama_pegawai"
                },
                {
                    title: "Aksi",
                    className: "dtfc-fixed-right_header",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return `<div class="d-flex justify-content-between gap-2 background_fixed_right_row">
                                <a href="${baseurl}/spp/cetak_bukti_pembayaran/${row.id_transaksi}" class="btn btn-danger w-100"><i class="fa fa-file-pdf-o"></i> Cetak</a>
                                <a href="${baseurl}/spp/transaksi_pembayaran/${row.id_transaksi}" class="btn btn-success w-100"><i class="fa fa-edit"></i></a>
                                <a href="javascript:void(0)" onclick="hapusdaftarpembayaran('${row.id_transaksi}','${row.no_transaksi}')" class="btn btn-danger w-100"><i class="fa fa-trash-o"></i></a></div>`;
                        }       
                        return data;
                    }
                }
            ]
        });
    });
}
function lihatDetailTransaksi(id_transaksi) {
    $.get('/generate-csrf-token', function(response) {
        $.ajax({
            url: baseurlapi + '/spp/detail_transaksi',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
            },
            data: {
                _token: response.csrf_token,
                id_transaksi: id_transaksi,
                parameter_pencarian: $("#pencarian_detail_transaksi_daftar_pembayaran").val()
            },
            success: function(response) {
                if ($.fn.dataTable.isDataTable('#datatables_detail_transaksi_daftar_pembayaran')) {
                    $('#datatables_detail_transaksi_daftar_pembayaran').DataTable().clear().destroy();
                }
                $("#datatables_detail_transaksi_daftar_pembayaran").DataTable({
                    dom: 't',
                    ordering: false,
                    paging: false,
                    data: response.data,
                    columns: [
                        {title: "No", render: function(data, type, row, meta) {
                            return meta.row + meta.settings._iDisplayStart + 1;
                        }},
                        {title: "Bulan", render: function(data, type, row, meta) {
                            return `${convertNumericToBulan([row.kode_bulan])}`;
                        }},
                        {title: "Nominal", render: function(data, type, row, meta) {
                            return `Rp. ${new Intl.NumberFormat('id-ID').format(row.nominal)}`;
                        }},
                        {title: "Keterangan", render: function(data, type, row, meta) {
                            return `${row.keterangan === null ? 'Tidak ada keterangan' : row.keterangan}`;
                        }},
                    ],
                    error: function (xhr, error, thrown) {
                        console.error('DataTables Error:', error, thrown);
                    }
                });
                $("#modalDetailTransaksi").modal('show');
            },
            error: function(xhr, status, error) {
                return createToast('Kesalahan Cek Data', 'top-right', xhr.responseJSON.message, 'error', 3000);
            }
        });
    });
}
function hapusdaftarpembayaran(id_transaksi, no_transaksi) {
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://cdn.lordicon.com/gsqxdxog.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Penghapusan Data Pembayaran Siswa SMK PGRI 6 Malang</h4><p class="text-muted mx-4 mb-0">Apakah anda yakin ingin menghapus data pembayaran siswa SMK PGRI 6 Malang dengan No. Transaksi <strong>'+no_transaksi+'</strong> ?. Jika data dihapus maka tagihan siswa akan ditambahkan kembali sesuai dengan nominal pembayaran awal</p></div></div>',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Hapus Data',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    url: baseurlapi + '/spp/hapus_pembayaran',
                    type: 'GET',
                    data: {
                        _token: response.csrf_token,
                        id_transaksi: id_transaksi,
                        no_transaksi: no_transaksi
                    },
                    success: function(response){
                        if (response.rc === 200) {    
                            createToast('Hapus Data Berhasil', 'top-right', response.message, 'success', 3000);
                            $("#datatables_daftar_pembayaran").DataTable().ajax.reload();
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
$('#pencarian_detail_transaksi_daftar_pembayaran').on('keyup', debounce(function(){
    const searchTerm = $(this).val().toLowerCase();
    $('#datatables_detail_transaksi_daftar_pembayaran').DataTable().rows().every(function(rowIdx, tableLoop, rowLoop) {
        const data = this.data();
        const nominal = data.nominal.toString();
        const keterangan = (data.keterangan || "Tidak ada keterangan").toLowerCase();

        // Periksa apakah pencarian cocok dengan salah satu kolom
        const isMatch =
            nominal.includes(searchTerm) ||
            keterangan.includes(searchTerm);
        if (isMatch) {
            $(this.node()).show();
        } else {
            $(this.node()).hide();
        }
    });
}, 300));