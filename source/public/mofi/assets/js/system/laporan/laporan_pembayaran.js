$(document).ready(function() {
    flatpickr("#kotak_tanggal_laporan_pembayaran",{
        mode:"range",
        dateFormat: "d-m-Y",
        maxDate: "today",
        defaultDate: [
            moment().startOf('month').format('DD-MM-YYYY'),
            "today"
        ],
        locale:{
            rangeSeparator: " sampai ",
        },
        onChange: function(selectedDates, dateStr, instance) {
            instance.element.value = dateStr;
        },      
    });
    datatables_laporan_pembayaran();
});
function datatables_laporan_pembayaran(){
    $.get('/generate-csrf-token', function(response) {
        $("#datatables_laporan_pembayaran").DataTable({
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
                "url": baseurlapi + '/laporan/laporanpembayaran',
                "type": "GET",
                "beforeSend": function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                },
                "data": function(d) {
                    let tanggal_input = $("#kotak_tanggal_laporan_pembayaran").val();
                    let tanggal_awal = tanggal_input.split(' sampai ')[0].split('-').reverse().join('-');
                    let tanggal_akhir = tanggal_input.split(' sampai ')[1];
                    tanggal_akhir = tanggal_akhir ? tanggal_akhir.split('-').reverse().join('-') : tanggal_awal;
                    d._token = response.csrf_token;
                    d.parameter_pencarian = $("#kotak_pencarian_laporan_pembayaran").val();
                    d.tanggal_awal = tanggal_awal;
                    d.tanggal_akhir = tanggal_akhir;
                },
                "dataSrc": function(json) {
                    let detailData = json.data;
                    let totalNominal = detailData.reduce((acc, item) => acc + parseFloat(item.total_transaksi_bayar || 0), 0);
                    $("#total_nominal").text(`Rp. ${totalNominal.toLocaleString('id-ID')}`);
                    $("#judul_laporan_pembayaran").text(`Informasi Pembayaran Per Tanggal ${$("#kotak_tanggal_laporan_pembayaran").val()}`);
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
                    title: "No. Transaksi / Trx / Tanggal",
                    render: function(data, type, row, meta) {
                        return `No. Transaksi: ${row.no_transaksi}<br>Jumlah Trx: ${row.jumlah_trx} Trx<br>Tanggal: ${row.tanggal_transaksi}`;
                    }
                },
                {
                    title: "Informasi Siswa",
                    render: function(data, type, row, meta) {
                        return `NIS: ${row.nis}<br>NISN: ${row.nisn}<br>Nama Siswa: ${row.nama_siswa}`;
                    }
                },
                {
                    title: "Total Nominal (IDR)",
                    className: "text-end", // Bootstrap class untuk rata kanan
                    render: function (data, type, row, meta) {
                        return `<span style="font-size: 20px; font-weight: bold;">${row.total_transaksi_bayar.toLocaleString('id-ID')}</span>`;
                    }
                },
                {
                    title: "Aksi",
                    className: "dtfc-fixed-right_header",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return "<div class=\"d-flex justify-content-between gap-2 background_fixed_right_row\"><button onclick=\"detail_transaksi_pembayaran('" + row.id_transaksi + "')\" class=\"btn btn-success w-100\"><i class=\"fa fa-edit\"></i> Detail Transaksi</button></div>";
                        }       
                        return data;
                    }
                }
            ]
        });
    });
}
$("#proses_laporan_pembayaran").click(function(e){
    e.preventDefault();
    $("#datatables_laporan_pembayaran").DataTable().ajax.reload();
});
function detail_transaksi_pembayaran(id_transaksi){
    $.get('/generate-csrf-token', function(response) {
        $.ajax({
            url: baseurlapi + '/spp/detail_transaksi_id',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
            },
            data: {
                _token: response.csrf_token,
                id_transaksi: id_transaksi,
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
                        {title: "Jenis Pembayaran", render: function(data, type, row, meta) {
                            return ` ${row.jenis_transaksi} (${convertNumericToBulan([row.kode_bulan])})`;
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