let formValidasi = $("#formulir_tambah_paket_mcu");let isedit = false;let idpaketmcu = "";
$(document).ready(function() {
    daftarpaketmcu();
    getPoli();
});
const hargapaketmcu = new AutoNumeric('#hargapaketmcu', {
    digitGroupSeparator: '.',
    decimalCharacter: ',',
    decimalPlaces: 2,
});
function getPoli() {
    $.get('/generate-csrf-token', function(response){
        $.ajax({
            url: baseurlapi + '/komponen/daftarpoli',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
            },
            data: {
                _token: response.csrf_token,
                katakuncipencarian: ""
            },
            success: function(response) {
                const whitelist = response.data.map(poli => ({
                    value: poli.nama_poli,
                    nilai: poli.kode_poli
                }));
                tagify.settings.whitelist = whitelist;
                tagify.dropdown.show();
            },
            error: function(xhr) {
                createToast('Error', 'top-right', xhr.responseJSON.message, 'error', 3000);
            }
        });
    });
}
function daftarpaketmcu() {
    $.get('/generate-csrf-token', function(response) {
        $("#datatable_paketmcu").DataTable({
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
            scrollCollapse: true,
            scrollX: true,
            bFilter: false,
            bInfo: true,
            ordering: false,
            bPaginate: true,
            bProcessing: true,
            serverSide: true,
            ajax: {
                "url": baseurlapi + '/masterdata/daftarpaketmcu',
                "type": "GET",
                "beforeSend": function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                },
                "data": function(d) {
                    d._token = response.csrf_token;
                    d.parameter_pencarian = $("#kotak_pencarian_paket_mcu").val();
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
                    title: "Kode Paket",
                    data: "kode_paket"
                },
                {
                    title: "Nama Paket",
                    data: "nama_paket"
                },
                {
                    title: "Harga",
                    data: "harga_paket",
                    render: function(data) {
                        return '<div style="text-align: right;">' + new Intl.NumberFormat('id-ID', { 
                            style: 'currency', 
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(data) + '</div>';
                    }
                },
                {
                    title: "Keterangan Akses Poli",
                    render: function(data, type, row, meta) {
                        const polis = row.akses_poli.split(',').map(poli => 
                            `<span class="badge badge-primary">${poli.trim()}</span>`
                        ).join(' ');
                        return `Keterangan: ${row.keterangan}<br>Akses : ${polis}`;
                    }
                },
                {
                    title: "Aksi",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return "<div class=\"d-flex justify-content-between gap-2\"><button class=\"btn btn-primary w-100\" onclick=\"editpaketmcu('" + row.id + "','" + row.kode_paket + "','" + row.nama_paket + "','" + row.harga_paket + "','" + row.akses_poli + "','" + row.keterangan + "')\"><i class=\"fa fa-edit\"></i> Edit Paket MCU</button><button class=\"btn btn-danger w-100\" onclick=\"hapuspaketmcu('" + row.id + "','" + row.kode_paket + "')\"><i class=\"fa fa-trash-o\"></i> Hapus Paket MCU</button></div>";
                        }
                        return data;
                    }
                }
            ]
        });
    }); 
}
$("#kotak_pencarian_paket_mcu").on("keyup change", debounce(function() {
    $("#datatable_paketmcu").DataTable().ajax.reload();
}, 300));
$("#tambah_paket_mcu_baru").click(function() {
    isedit = false;
    $("#formulir_tambah_paket_mcu").modal("show");
});
$("#simpan_paket_mcu").click(function(event) {
    event.preventDefault();
    formValidasi.addClass('was-validated');
    if ($("#kodepaketmcu").val() == "" || $("#namapaketmcu").val() == "" || $("#hargapaketmcu").val() == "" || $("#aksespolipaketmcu").val() == "" || $("#keteranganpaketmcu").val() == "") {
        return createToast('Kesalahan Formulir', 'top-right', 'Silahkan isi semua field pada formulir terlebih dahulu sebelum anda menyimpan data harga paket MCU.', 'error', 3000);
    }
    if (hargapaketmcu.get() == 0) {
        return createToast('Kesalahan Formulir', 'top-right', 'Harga paket MCU tidak boleh 0.', 'error', 3000);
    }
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53c357e2-68f2-4954-abff-939a52e6a61a/PB4F7KPq65.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Penyimpanan Data Paket MCU</h4><p class="text-muted mx-4 mb-0">Apakah anda yakin ingin menyimpan informasi paket MCU <strong>'+$(namapaketmcu).val()+'</strong> ?. Jika sudah silahkan tentukan paket MCU yang akan digunakan',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Simpan Data',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    url: baseurlapi + '/masterdata/' + (isedit ? 'ubahpaketmcu' : 'simpanpaketmcu'),
                    type: 'POST',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        id: idpaketmcu,
                        kode_paket: $("#kodepaketmcu").val(),
                        nama_paket: $("#namapaketmcu").val(),
                        harga_paket: hargapaketmcu.get(),
                        akses_poli: $("#aksespolipaketmcu").val(),
                        keterangan: $("#keteranganpaketmcu").val(),
                    },
                    success: function(response) {
                        clearFormulirTambahPaketMcu();
                        createToast('Informasi', 'top-right', response.message, 'success', 3000);
                        $("#formulir_tambah_paket_mcu").modal("hide");
                        $("#datatable_paketmcu").DataTable().ajax.reload();
                    },
                    error: function(xhr) {
                        createToast('Kesalahan', 'top-right', xhr.responseJSON.message, 'error', 3000);
                    }
                });
            });
        }
    });
});
function clearFormulirTambahPaketMcu() {
    formValidasi.removeClass('was-validated');
    isedit = false;
    idpaketmcu = "";
    hargapaketmcu.set(0);
    $("#kodepaketmcu").val("");
    $("#namapaketmcu").val("");
    $("#hargapaketmcu").val("");
    $("#aksespolipaketmcu").val("");
    $("#keteranganpaketmcu").val("");
}
let input = document.querySelector("#aksespolipaketmcu"),
tagify = new Tagify(input, {
    whitelist: [],
    dropdown: {
        position: "manual",
        maxItems: Infinity,
        enabled: 0,
        classname: "customSuggestionsList",
    },
    templates: {
        dropdownItemNoMatch() {
            return `<div class='empty'>Data Poli Tidak Ditemukan</div>`;
        },
    },
    enforceWhitelist: true,
});

tagify.on("dropdown:show",function(e){}).on("dropdown:hide",function(){}).on("dropdown:scroll",function(e){});(function(){tagify.dropdown.show();tagify.DOM.scope.parentNode.appendChild(tagify.DOM.dropdown)})();
function hapuspaketmcu(id, nama) {
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53a48ece-27d3-4b85-9150-8005e7c27aa4/usrEqiqrei.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Penghapusan Data Paket MCU <strong>'+nama+'</strong></h4><p class="text-muted mx-4 mb-0">Informasi yang terkait dengan paket MCU <strong>'+nama+'</strong> tidak akan hilang tetapi tidak ditampilkan di sistem. Apakah anda yakin ingin melanjutkan proses penghapusan ini ?</p></div>',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Hapus Data',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    url: baseurlapi + '/masterdata/hapuspaketmcu',
                    type: 'GET',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        id: id,
                        nama_paket: nama,
                    },
                    success: function(response) {
                        isedit = false;
                        createToast('Informasi', 'top-right', response.message, 'success', 3000);
                        $("#datatable_paketmcu").DataTable().ajax.reload();
                    },
                    error: function(xhr) {
                        createToast('Kesalahan', 'top-right', xhr.responseJSON.message, 'error', 3000);
                    }
                });
            });
        }
    });
}
function editpaketmcu(id, kode, nama, harga, akses, keterangan) {
    isedit = true;
    idpaketmcu = id;
    $("#kodepaketmcu").val(kode);
    $("#namapaketmcu").val(nama);
    hargapaketmcu.set(harga);
    $("#aksespolipaketmcu").val(akses);
    $("#keteranganpaketmcu").val(keterangan);
    $("#formulir_tambah_paket_mcu").modal("show");
}