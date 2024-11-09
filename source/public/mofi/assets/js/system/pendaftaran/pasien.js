$(document).ready(function() {
    loadDataPasien();
});

function loadDataPasien() {
    $.get('/generate-csrf-token', function(response) {
        $("#datatables_daftarpasien").DataTable({
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
                "url": baseurlapi + '/pendaftaran/daftarpasien',
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
                    title: "Nomor MCU",
                    data: "no_transaksi"
                },
                {
                    title: "Nama Peserta",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return `${row.nama_peserta} (${row.umur}Th)`;
                        }
                        return data;
                    }
                },
                {
                    title: "Informasi MCU",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return `Tanggal: ${row.tanggal_transaksi}<br>Nama Paket: <span onclick="lihatDetailPaket('${row.akses_poli}')" style="cursor: pointer;color: blue;">${row.nama_paket}</span><br>`;
                        }
                        return data;
                    }
                },
                {
                    title: "Informasi Perusahaan",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return `Perusahaan: ${row.company_name}<br>Departemen: ${row.nama_departemen}`;
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
                                <a href="${baseurl}/pendaftaran/formulir_ubah_peserta/${row.id}">
                                    <button class="btn btn-success w-100"><i class="fa fa-edit"></i></button>
                                </a>
                                <button onclick="hapusdaftarpeserta('${row.no_transaksi}','${row.id}', '${row.nama_peserta}')" class="btn btn-danger w-100">
                                    <i class="fa fa-trash-o"></i>
                                </button>
                            </div>`;
                        }       
                        return data;
                    }
                }
            ]
        });
    });
}
function lihatDetailPaket(akses_poli) {
    const poliList = akses_poli.split(',');
    let buttons = '';
    poliList.forEach(poli => {
        buttons += `<button class="btn btn-success m-1"><i class="fa fa-check"></i> ${poli.trim()}</button>`;
    });
    $("#detail_paket_mcu").html(`<div class="text-center">${buttons}</div>`);
    $("#modal_detail_paket_mcu").modal("show");
}
function hapusdaftarpeserta(no_transaksi,id_transaksi, nama_pasien) {
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53a48ece-27d3-4b85-9150-8005e7c27aa4/usrEqiqrei.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Hapus Data Pasien<br> '+nama_pasien+'</h4><p class="text-muted mx-4 mb-0">Apakah anda ingin menghapus informasi member MCU <strong>'+nama_pasien+'</strong> dengan No Trx:  <strong>'+no_transaksi+'</strong> ? Peserta yang dihapus harus mendaftar ulang pada website jikalau ingin melanjutkan pendaftaran menjadi pasien MCU serta data terkait dengan transaksi ini akan dihapus</p></div>',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Hapus Data',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response) {
                $.ajax({
                    url: baseurlapi + '/transaksi/hapuspeserta',
                    type: 'GET',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        no_transaksi: no_transaksi,
                        id_transaksi: id_transaksi,
                        nama_peserta: nama_pasien,
                    },
                    success: function(response) {
                        $("#datatables_daftarpasien").DataTable().ajax.reload();
                        createToast('Hapus Informasi', 'top-right', response.message, 'success', 3000);
                    },
                    error: function(xhr, status, error) {
                        createToast('Kesalahan Penghapusan Data', 'top-right', error, 'error', 3000);
                    }
                });
            });
        }
    });
}