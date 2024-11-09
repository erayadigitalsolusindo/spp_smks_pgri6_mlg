$(document).ready(function() {
    tabel_datatagihan();
});
function tabel_datatagihan() {
    $.get('/generate-csrf-token', function(response) {
        $("#datatables_tagihan").DataTable({
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
                "url": baseurlapi + '/spp/daftar_tagihan',
                "type": "GET",
                "beforeSend": function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                },
                "data": function(d) {
                    d._token = response.csrf_token;
                    d.parameter_pencarian = $("#kotak_pencarian_tagihan").val();
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
                    title: "NIS",
                    data: "nis"
                },
                {
                    title: "Nama Siswa",
                    data: "nama_siswa"
                },
                {
                    title: "Informasi Kelas",
                    render: function(data, type, row, meta) {
                        return row.tingkat_kelas + ' - ' + row.nama_jurusan;
                    }
                },
                {
                    title: "Juli",
                    data: "juli"
                },
                {
                    title: "Agustus",
                    data: "agustus"
                },
                {
                    title: "September",
                    data: "september"
                },
                {
                    title: "Oktober",
                    data: "oktober"
                },
                {
                    title: "November",
                    data: "november"
                },
                {
                    title: "Desember",
                    data: "desember"
                },
                {
                    title: "Januari",
                    data: "januari"
                },
                {
                    title: "Februari",
                    data: "februari"
                },
                {
                    title: "Maret",
                    data: "maret"
                },
                {
                    title: "April",
                    data: "april"
                },
                {
                    title: "Mei",
                    data: "mei"
                },
                {
                    title: "Juni",
                    data: "juni"
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
$("#kotak_pencarian_tagihan").on("keyup change", debounce(function() {
   $("#datatables_tagihan").DataTable().ajax.reload();
}, 300));