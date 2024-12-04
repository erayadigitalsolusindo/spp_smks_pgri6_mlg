let datatables_form_tagihan, var_id_siswa, var_nama_siswa, var_nis;
const nominal_tagihan = new AutoNumeric('#nominal_tagihan', {
    digitGroupSeparator: '.',
    decimalCharacter: ',',
    decimalPlaces: 0,
});
const berapa_kali_tagihan = new AutoNumeric('#berapa_kali_tagihan', {
    digitGroupSeparator: '.',
    decimalCharacter: ',',
    decimalPlaces: 0,
});
$(document).ready(function () {
    onloadselect2();
    datatables_form_tagihan = $('#datatables_form_tagihan').DataTable({
        searching: false,
        lengthChange: false,
        ordering: false,
        scrollCollapse: true,
        bFilter: false,
        bInfo: false,
        paging: false,
        scrollX: true,
        keys:true,
        language: {
            "paginate": {
                "first": '<i class="fa fa-angle-double-left"></i>',
                "last": '<i class="fa fa-angle-double-right"></i>',
                "next": '<i class="fa fa-angle-right"></i>',
                "previous": '<i class="fa fa-angle-left"></i>',
            },
        }
    }).on('key-focus', function ( e, datatable, cell, originalEvent ) {
        $('input', cell.node()).focus();
    }).on("focus", "td input", function(){
        $(this).select();
    }) 
    datatables_form_tagihan.on('key', function(e, dt, code) {
        if (code === 13) {
            datatables_form_tagihan.keys.move('down');
        }
    });
});
function onloadselect2(){
    $.get('/generate-csrf-token', function(response) {
        $('#select_siswa_transaksi_spp').select2({ 
            placeholder: 'Ketik berdasarkan NIS / Nama',
            allowClear: true,
            ajax: {
                url: baseurlapi + '/masterdata/daftarsiswa',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token_ajax') },
                method: 'GET',
                dataType: 'json',
                delay: 500,
                data: function (params) {
                    return {
                        _token : response.csrf_token,
                        parameter_pencarian : (typeof params.term === "undefined" ? "" : params.term),
                        start : 0,
                        length : 100,
                    }
                },
                processResults: function (data) {
                    return {
                        results: $.map(data.data, function (item) {
                            return {
                                text: `[${item.nis}] - ${item.nama_siswa}`,
                                id: `${item.nis}`,
                                data: item
                            }
                        })
                    }
                },
                error: function(xhr, status, error) {
                    return createToast('Kesalahan Penggunaan', 'top-right', xhr.responseJSON.message, 'error', 3000);
                }
            },
        }); 
        $('#daftar_kelas_form_tagihan').select2({ 
            placeholder: 'Tentukan berdasarkan kondisi kelas',
            allowClear: true,
            ajax: {
                url: baseurlapi + '/masterdata/daftarkelas',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token_ajax') },
                method: 'GET',
                dataType: 'json',
                delay: 500,
                data: function (params) {
                    return {
                        _token : response.csrf_token,
                        parameter_pencarian : (typeof params.term === "undefined" ? "" : params.term),
                        start : 0,
                        length : 100,
                    }
                },
                processResults: function (data) {
                    return {
                        results: $.map(data.data, function (item) {
                            return {
                                text: item.tingkat_kelas,
                                id: `${item.id}`,
                                data: item
                            }
                        })
                    }
                },
                error: function(xhr, status, error) {
                    return createToast('Kesalahan Penggunaan', 'top-right', xhr.responseJSON.message, 'error', 3000);
                }
            },
        }); 
    });
}
function tambah_siswa_keranjang(nis, nama, id_siswa){
    Swal.fire({
        title: 'Konfirmasi Siswa Ini Masuk Keranjang',
        text: 'Apakah anda ingin menambahkan tagihan untuk siswa ini dengan info '+nis+' - '+nama+' ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Tambahkan Siswa',
        cancelButtonText: 'Batal',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response) {
                $.ajax({
                    url: baseurlapi + '/masterdata/tambahkeranjangtagihan',
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token_ajax') },
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        _token : response.csrf_token,
                        id_siswa : id_siswa,
                    },
                    success: function(response) {
                        tambah_konfirmasi_tagihan(response.data[0].nis, response.data[0].nama_siswa, response.data[0].id, response.data[0].id_tahun_ajaran, response.data[0].tahun_ajaran);
                        scrollToLastRow();
                    },
                    error: function(xhr, status, error) {
                        return createToast('Kesalahan Penggunaan', 'top-right', xhr.responseJSON.message, 'error', 3000);
                    }
                });
            });
        }
    });
}
$('#select_siswa_transaksi_spp').on('select2:select', function (e) {
    let selectedData = e.params.data.data;
    var_nis = selectedData.nis;
    var_nama_siswa = selectedData.nama_siswa;
    var_id_siswa = selectedData.id_siswa;
    tambah_siswa_keranjang(selectedData.nis, selectedData.nama_siswa, selectedData.id_siswa);
});
$('#daftar_kelas_form_tagihan').on('select2:select', function (e) {
    let selectedData = e.params.data.data;
    Swal.fire({
        title: 'Konfirmasi Tambah Keranjang',
        text: 'Apakah anda ingin menambahkan tagihan untuk kelas '+selectedData.tingkat_kelas+' ini ? Mungkin ini membutuhkan waktu untuk membuat keranjang tagihan tergantung dari jumlah siswa yang terdaftar pada kelas ini, jika semakin banyak maka akan semakin lama',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Tambahkan',
        cancelButtonText: 'Batal',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response) {
                $.ajax({
                    url: baseurlapi + '/masterdata/tambahkeranjangtagihan',
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token_ajax') },
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        _token : response.csrf_token,
                        id_kelas : selectedData.id,
                    },
                    success: function(response) {
                        datatables_form_tagihan.rows().clear().draw();
                        response.data.forEach(siswa => {
                            tambah_konfirmasi_tagihan(siswa.nis, siswa.nama_siswa, siswa.id, siswa.id_tahun_ajaran, siswa.tahun_ajaran);
                        });
                        scrollToLastRow();
                    },
                    error: function(xhr, status, error) {
                        return createToast('Kesalahan Penggunaan', 'top-right', xhr.responseJSON.message, 'error', 3000);
                    }
                });
            });
        }
    });
});

function tambah_konfirmasi_tagihan(nis, nama, id, id_tahun_ajaran, tahun_ajaran) {
    const uniqueId = `nominal_${id}`;
    let row = [
        `${id}`,
        `${nis}`,
        `${nama}`,
        `[${id_tahun_ajaran}] - ${tahun_ajaran}`,
        `${$("#bulan_tagihan_form_tagihan option:selected").text()}`,
        `<input id="qty_${uniqueId}" type="text" class="perulangan_tagihan form-control" value="${$("#berapa_kali_tagihan").val()}" placeholder="0.00">` ,
        `<input id="nom_${uniqueId}" type="text" class="nominal_tagihan form-control" value="${nominal_tagihan.getNumber()}" placeholder="0.00">`,
        `<button onclick="hapusbarisini('${uniqueId}')" id="hapus_${uniqueId}" class="btn btn-danger"><i class="fa fa-trash"></i></button>`,
    ];
    datatables_form_tagihan.row.add(row).draw();
    setTimeout(() => {
        new AutoNumeric(`#qty_${uniqueId}`, {
            digitGroupSeparator: '.',
            decimalCharacter: ',',
            decimalPlaces: 0,
            modifyValueOnUpDownArrow: false,
            modifyValueOnWheel: false,
        });
        new AutoNumeric(`#nom_${uniqueId}`, {
            digitGroupSeparator: '.',
            decimalCharacter: ',',
            decimalPlaces: 0,
            modifyValueOnUpDownArrow: false,
            modifyValueOnWheel: false,
        });
    }, 0);
}
function hapusbarisini(barisii){
    let uniqueId = barisii;
    let row = $(`#qty_${uniqueId}`).closest('tr');
    datatables_form_tagihan.row(row).remove().draw();
}
function tentukan_tagihan() {
    let amount = nominal_tagihan.getNumber();   
    let qty = berapa_kali_tagihan.getNumber();
    datatables_form_tagihan.rows().every(function (rowIdx, tableLoop, rowLoop) {
        const row = this.node();
        const inputField = $(row).find('input.nominal_tagihan');
        const inputFieldQty = $(row).find('input.perulangan_tagihan');
        if (inputField.length) {
            inputField.each(function () {
                const autoNumericInstance = AutoNumeric.getAutoNumericElement(this);
                if (autoNumericInstance) {
                    autoNumericInstance.set(amount);
                } else {
                    $(this).val(amount);
                }
            });
        }
        if (inputFieldQty.length) {
            inputFieldQty.each(function () {
                const autoNumericInstance = AutoNumeric.getAutoNumericElement(this);
                if (autoNumericInstance) {
                    autoNumericInstance.set(qty);
                } else {
                    $(this).val(amqtyount);
                }
            });
        }
    });
}

function scrollToLastRow() {
    let rowCount = datatables_form_tagihan.rows().count();
    if (rowCount > 0) {
        let lastRow = datatables_form_tagihan.row(rowCount - 1).node();
        let scrollBody = $(datatables_form_tagihan.table().container()).find('.dataTables_scrollBody');
        scrollBody.animate({
            scrollTop: lastRow.offsetTop
        }, 500);
    }
}
$('#cari_siswa_form_tagihan').on('keyup', debounce(function(){
    const searchTerm = $(this).val().toLowerCase();
    $('#datatables_form_tagihan').DataTable().rows().every(function(rowIdx, tableLoop, rowLoop) {
        const data = this.data();
        const nis = data[1].toString();     
        const nama = data[2].toLowerCase();     
        const isMatch =
            nis.includes(searchTerm) ||
            nama.includes(searchTerm);
        if (isMatch) {
            $(this.node()).show();
        } else {
            $(this.node()).hide();
        }
    });
}, 300));
function simpan_tagihan(){
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53c357e2-68f2-4954-abff-939a52e6a61a/PB4F7KPq65.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Transaksi Penetapan Tagihan</h4><p class="text-muted mx-4 mb-0">Penetapan tagihan akan dicatatakan pada siswa yang berada di tabel dibawah ini. Silahkan periksa kembali data yang akan dicatatkan dengan cara cari dan ubah data yang diperlukan. Jika sudah sesuai maka silahkan klik tombol simpan dibawah ini.</p></div>',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response) {
                let rowsData = [];
                datatables_form_tagihan.rows().every(function() {
                    const data = this.data();
                    const uniqueId = `nominal_${data[0]}`;
                    let row = {
                        id_siswa: data[0],
                        kode_jenis_transaksi: data[4].match(/\[(.*?)\]/)[1],
                        qty: AutoNumeric.getAutoNumericElement(`#qty_${uniqueId}`).getNumber(),
                        nominal: AutoNumeric.getAutoNumericElement(`#nom_${uniqueId}`).getNumber(),
                        id_tahun_ajaran: data[3].match(/\[(.*?)\]/)[1],
                    };
                    rowsData.push(row);
                });
            
                $.ajax({
                    url: baseurlapi + '/spp/simpantagihan_non_bulanan',
                    type: 'POST',
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token_ajax') },
                    data: {
                        _token: response.csrf_token,
                        rowsData: rowsData,
                    },
                    success: function(response) {
                        datatables_form_tagihan.rows().clear().draw();
                        nominal_tagihan.set(0);
                        berapa_kali_tagihan.set(0)
                        $("#nominal_tagihan").val("")
                        $("#berapa_kali_tagihan").val("")
                        $('#bulan_tagihan_form_tagihan').prop('selectedIndex', 0).trigger('change');
                        return createToast('Informasi', 'top-right', response.message, 'success', 3000);
                    },
                    error: function(xhr, status, error) {
                        return createToast('Kesalahan Penggunaan', 'top-right', xhr.responseJSON.message, 'error', 3000);
                    }
                });
            });
            
        }
    });
}
$("#tambah_ke_daftar").on('click', function(){
    tambah_siswa_keranjang(var_nis, var_nama_siswa, var_id_siswa);
})