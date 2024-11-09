$(document).ready(function() {
    loadDataPeserta();
});

function loadDataPeserta() {
    $.get('/generate-csrf-token', function(response) {
        $("#datatables_daftarpeserta").DataTable({
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
                "url": baseurlapi + '/pendaftaran/daftarpeserta',
                "type": "GET",
                "beforeSend": function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                },
                "data": function(d) {
                    d._token = response.csrf_token;
                    d.parameter_pencarian = $("#kotak_pencarian_daftarpeserta").val();
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
                    title: "Nomor Identitas",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return `Kode UUID : ${row.uuid}<br>NIK/KTP/Paspor/Visa : ${row.nomor_identitas}`;
                        }
                        return data;
                    }
                },
                {
                    title: "Nama Peserta",
                    data: "nama_peserta"
                },
                {
                    title: "Tempat Lahir",
                    data: "tempat_lahir"
                },
                {
                    title: "Tanggal Lahir",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return row.tanggal_lahir.split("-").reverse().join("-") + " (" + row.umur + " Tahun)";
                        }
                        return data;
                    }
                },
                {
                    title: "Tipe Identitas", 
                    data: "tipe_identitas"
                },
                {
                    title: "Jenis Kelamin",
                    data: "jenis_kelamin"
                },
                {
                    title: "Alamat",
                    data: "alamat"
                },
                {
                    title: "Status Kawin",
                    data: "status_kawin"
                },
                {
                    title: "No Telepon",
                    data: "no_telepon"
                },
                {
                    title: "Waktu",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return `Waktu Pendaftaran: ${row.created_at}<br>Data Akan Dihapus: ${row.created_at_delete}`;
                        }
                        return data;
                    }
                },
                {
                    title: "Aksi",
                    className: "dtfc-fixed-right_header",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return "<div class=\"d-flex justify-content-between gap-2 background_fixed_right_row\"><a href=\""+baseurl+"/pendaftaran/formulir_tambah_peserta/"+row.uuid+"\" class=\"btn btn-success w-100\"><i class=\"fa fa-trash-o\"></i> Jadikan Peserta</a><button class=\"btn btn-danger w-100\" onclick=\"hapusdaftarpeserta('" + row.uuid + "','" + row.nama_peserta + "','"+row.nomor_identitas+"')\"><i class=\"fa fa-trash-o\"></i> Hapus Peserta</button></div>";
                        }       
                        return data;
                    }
                }
            ]
        });
    }); 
}
function hapusdaftarpeserta(idpeserta, nama_peserta, nomor_identitas) {
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53a48ece-27d3-4b85-9150-8005e7c27aa4/usrEqiqrei.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Penghapusan Data Member '+nama_peserta+'</h4><p class="text-muted mx-4 mb-0">Apakah anda yakin ingin menghapus informasi member MCU <strong>'+nama_peserta+'</strong> dengan ID <strong>'+nomor_identitas+'</strong> ? Peserta yang dihapus harus mendaftar ulang pada website jikalau ingin melanjutkan pendaftaran menjadi pasien MCU',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Hapus Data',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    url: baseurlapi + '/pendaftaran/hapuspeserta',
                    type: 'GET',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        id: idpeserta,
                        nama_peserta: nama_peserta,
                    },
                    success: function(response) {
                        $("#datatables_daftarpeserta").DataTable().ajax.reload();
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