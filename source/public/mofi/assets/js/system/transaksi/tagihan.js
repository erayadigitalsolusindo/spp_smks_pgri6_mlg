$(document).ready(function() {
    setTimeout(function() {
        tabel_datatagihan();
    }, 500);
});function tabel_datatagihan() {
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
                url: baseurlapi + '/spp/daftar_tagihan',
                type: "GET",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                },
                data: function(d) {
                    d._token = response.csrf_token;
                    d.parameter_pencarian = $("#kotak_pencarian_tagihan").val();
                    d.start = 0;
                    d.length = 200;
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
                { 
                    title: "Informasi Kelas", 
                    className: "text-center", 
                    render: (data, type, row) => `${row.tingkat_kelas} - ${row.tahun_ajaran}` 
                },
                ...["juli", "agustus", "september", "oktober", "november", "desember", "januari", "februari", "maret", "april", "mei", "juni"].flatMap(month => [
                    { 
                        title: month.charAt(0).toUpperCase() + month.slice(1), 
                        className: "text-center", 
                        render: (data, type, row) => `<div class="text-center">${row[month] === 0 ? '<span class="text-danger">LUNAS</span>' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row[month])}</div>`
                    },
                    { 
                        title: `Σ Tagihan ${month.charAt(0).toUpperCase() + month.slice(1)}`, 
                        className: "text-center", 
                        render: (data, type, row) => `<div class="text-center">${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row[`total_tagihan_${month}`])}</div>` 
                    }
                ]),
                { 
                    title: "Aksi", 
                    className: "dtfc-fixed-right_header text-center", 
                    render: (data, type, row) => `
                        <div class="d-flex justify-content-between gap-2 background_fixed_right_row">
                            <button class="btn btn-primary w-100" onclick="editdaftarbank('${row.id}', '${row.kode_bank}', '${row.nama_bank}', '${row.keterangan}')">
                                <i class="fa fa-edit"></i> Detail
                            </button>
                            <button class="btn btn-danger w-100" onclick="hapusdaftarbank('${row.id}', '${row.nama_bank}')">
                                <i class="fa fa-trash-o"></i> Hapus
                            </button>
                        </div>`
                }
            ]
        });
    });
}

$("#kotak_pencarian_tagihan").on("keyup change", debounce(function() {
   $("#datatables_tagihan").DataTable().ajax.reload();
}, 300));