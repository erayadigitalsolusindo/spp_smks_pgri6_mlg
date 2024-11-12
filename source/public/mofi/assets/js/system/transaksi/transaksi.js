let table_datatables_transaksi_spp;
let nominal_pembayaran_per_baris = [];
const nominal_pembayaran_transaksi_spp = new AutoNumeric('#nominal_pembayaran_transaksi_spp', {
    digitGroupSeparator: '.',
    decimalCharacter: ',',
    decimalPlaces: 2,
});
const nominal_bayar_konfirmasi= new AutoNumeric('#nominal_bayar_konfirmasi', {
    digitGroupSeparator: '.',
    decimalCharacter: ',',
    decimalPlaces: 2,
});
$(document).ready(function() {
    onloadselect2();
    onloaddatatables();
    getSelectedMonths();
});

function onloaddatatables(){
    flatpickr("#tanggal_transaksi_spp", {
        dateFormat: "d-m-Y",
        maxDate: moment().format('DD-MM-YYYY'),
    });
    $("#tanggal_transaksi_spp").val(moment().format('DD-MM-YYYY'));
    if (!$.fn.dataTable.isDataTable('#datatables_transaksi_spp')) {
        table_datatables_transaksi_spp = $('#datatables_transaksi_spp').DataTable({
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
            bFilter: false,
            bInfo: false,
            paging: false,
            scrollY: "300px",
            scrollX: true,
        });
    }
}
function onloadselect2(){
    $("#kartu_informasi_peserta").hide();
    $.get('/generate-csrf-token', function(response) {
        $('#select_jenis_pembayaran_transaksi_spp').select2({
            placeholder: 'Pilih Jenis Pembayaran',
            allowClear: true,
            ajax: {
                url: baseurlapi + '/masterdata/jenispembayaran',
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
                                text: `[${item.kode}] - ${item.jenis_transaksi}`,
                                id: `${item.kode}`,
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
    });
}
function getSelectedMonths() {
    const monthNames = ["januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"];
    const currentMonthIndex = new Date().getMonth();
    const currentMonthId = monthNames[currentMonthIndex];
    $("#" + currentMonthId).prop("checked", true);
}
$('#select_siswa_transaksi_spp').on('select2:select', function(e) {
    let data = e.params.data.data;
    $('#id_temp').text(data.id_siswa);
    $('#nama_peserta_temp').text(data.nama_siswa);
    $('#nomor_induk_siswa_temp').text(data.nis);
    $('#nama_siswa_temp').text(data.nama_siswa); 
    $('#jenis_kelamin_temp').text(data.jenis_kelamin == "L" ? "Laki-laki" : "Perempuan");
    $('#alamat_temp').text(data.alamat_siswa);
    $('#no_telepon_temp').text(data.no_telepon);
    $('#email_temp').text(data.email);
    $('#kelas_temp').text(data.tingkat_kelas);
    $('#tahun_ajaran_temp').text(data.tahun_ajaran);
});
$('#select_jenis_pembayaran_transaksi_spp').on('select2:select', function(e) {
    nominal_pembayaran_transaksi_spp.set(0);
    $('#nominal_pembayaran_transaksi_spp').focus();
});
let selectedBulan = [];

function tambah_baris_transaksi_spp() {
    // Reset selected months
    selectedBulan = [];

    // Validate nominal pembayaran and jenis pembayaran fields
    if (nominal_pembayaran_transaksi_spp.getNumber() === 0) {
        return createToast('Informasi', 'top-right', 'Nominal Pembayaran tidak boleh 0', 'error', 3000);
    }
    if ($('#select_jenis_pembayaran_transaksi_spp').val() == null) {
        return createToast('Informasi', 'top-right', 'Jenis Pembayaran tidak boleh kosong', 'error', 3000);
    }

    // Get selected months
    $('#juli, #agustus, #september, #oktober, #november, #desember, #januari, #februari, #maret, #april, #mei, #juni').each(function() {
        if ($(this).is(":checked")) {
            selectedBulan.push($(this).attr('id'));
        }
    });

    // Get jenis pembayaran and nominal values
    let jenisPembayaranValue = $('#select_jenis_pembayaran_transaksi_spp').val();
    let jenisPembayaranText = $('#select_jenis_pembayaran_transaksi_spp option:selected').text().split('-')[1].trim();
    let nominalPembayaran = nominal_pembayaran_transaksi_spp.getNumber();

    selectedBulan.forEach(bulan => {
        let found = false;
        let rows = table_datatables_transaksi_spp.rows().nodes();

        // Check if there's already a row for the same jenis pembayaran and month
        for (let i = 0; i < rows.length; i++) {
            let row = $(rows[i]);
            let currentJenisPembayaran = row.find('input.form-control').first().val();
            let currentBulan = row.find('td:eq(3)').text().toLowerCase();

            if (currentJenisPembayaran === jenisPembayaranValue && currentBulan === bulan) {
                // Update the existing row's nominal pembayaran
                let currentNominalPembayaran = AutoNumeric.getAutoNumericElement(row.find('.nominal_pembayaran')[0]);
                currentNominalPembayaran.set(currentNominalPembayaran.getNumber() + nominalPembayaran);
                found = true;
                break;
            }
        }

        // Add a new row if no match was found
        if (!found) {
            // Generate a unique ID for the nominal pembayaran field
            let uniqueId = `nominal_pembayaran_${bulan}_${Date.now()}`;

            table_datatables_transaksi_spp.row.add([
                '',
                `<input readonly style="background-color: transparent;border: none;" type="text" class="form-control" value="${jenisPembayaranValue}">`,
                `<input readonly style="background-color: transparent;border: none;" type="text" class="form-control" value="${jenisPembayaranText}">`,
                `${bulan}`,
                `<input id="${uniqueId}" style="background-color: transparent;border: none;" type="text" class="form-control nominal_pembayaran" value="${nominalPembayaran}" placeholder="0.00">`,
                `<input type="text" class="form-control" value="" placeholder="Isikan keterangan pembayaran">`,
                `<button class="hapus_baris btn btn-danger w-100"><i class="fa fa-trash"></i> Hapus</button>`,
            ]).draw();

            // Initialize AutoNumeric on the new nominal pembayaran field
            new AutoNumeric(`#${uniqueId}`, nominalPembayaran, {
                digitGroupSeparator: ',',
                decimalCharacter: '.',
                decimalPlaces: 2
            });
        }
    });

    // Update row numbers and scroll to the last row
    updateNomorUrut();
    scrollToLastRow();
    updateGrandTotal();
}


$('.nominal_pembayaran').each(function() {
    $(this).on('keydown', function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
           
        }
    });
});
function scrollToLastRow() {
    let rowCount = table_datatables_transaksi_spp.rows().count();
    if (rowCount > 0) {
        let lastRow = table_datatables_transaksi_spp.row(rowCount - 1).node();
        let scrollBody = $(table_datatables_transaksi_spp.table().container()).find('.dataTables_scrollBody');
        scrollBody.animate({
            scrollTop: lastRow.offsetTop
        }, 500);
    }
}
function updateNomorUrut() {
    table_datatables_transaksi_spp.rows().every(function(index) {
        this.cell(index, 0).data(index + 1);
    }).draw();
}
function updateGrandTotal() {
    let grandTotal = 0;
    table_datatables_transaksi_spp.rows().every(function() {
        const nominalElement = $(this.node()).find('.nominal_pembayaran');
        if (nominalElement.length) {
            grandTotal += AutoNumeric.getAutoNumericElement(nominalElement[0]).getNumber();
        }
    });
    nominal_bayar_konfirmasi.set(grandTotal);
}

function initializeAutoNumeric() {
    $('.nominal_pembayaran').each(function() {
        if (!AutoNumeric.getAutoNumericElement(this)) {
            new AutoNumeric(this, {
                decimalCharacter: ',',
                digitGroupSeparator: '.',
                currencySymbol: '',
                unformatOnSubmit: true
            });
        }
    });
    nominal_pembayaran_transaksi_spp.set(0);
    $('#select_jenis_pembayaran_transaksi_spp').val(null).trigger('change');
    
}

$("#nominal_pembayaran_transaksi_spp").on("keyup", function(event) {
    if (event.keyCode === 13) {
        tambah_baris_transaksi_spp()
    }
});
$("#btnTambahJenisPembayaranTransaksiSPP").on("click", function(event) {
    tambah_baris_transaksi_spp()
});

$('#datatables_transaksi_spp').on('click', '.hapus_baris', function() {
    let table = $('#datatables_transaksi_spp').DataTable();
    let row = $(this).closest('tr');            
    if (row.hasClass('child')) {
        table.row(row.prev('tr')).remove().draw();
    } else {
        table.row(row).remove().draw();
    }
    updateNomorUrut();
    initializeAutoNumeric();
    updateGrandTotal();
});

$("#btnKonfirmasiTransaksiSPP").on("click", function(event) {
    let kodeJenisTransaksiArray = [], nominalBayarArray = [], keteranganArray = [], kodebulanArray = [];
    if (nominal_bayar_konfirmasi.getNumber() == 0) {
        return createToast('Informasi', 'top-right', 'Pembayaran pada transaksi ini harus lebih besar dari 0. Silahkan cek kembali transaksi pembayaran SPP', 'error', 3000);
    }
    if ($("#select_siswa_transaksi_spp").val() == null) {
        return createToast('Informasi', 'top-right', 'Tentukan terlebih dahulu siswa yang akan ditransaksi pembayaran SPP. 1 Transaksi hanya untuk 1 Siswa', 'error', 3000);
    }
    if (table_datatables_transaksi_spp.rows().count() == 0) {
        return createToast('Informasi', 'top-right', 'Silahkan tentukan terlebih dahulu jenis pembayaran dan nominal pembayaran untuk transaksi ini. Minimal jenis pembayaran 1 transaksi dengan nominal pembayaran lebih besar dari 0', 'error', 3000);
    }
    table_datatables_transaksi_spp.rows().every(function() {
        let rowNode = $(this.node());
        let currentKodeJenisTransaksi = rowNode.find('td').eq(1).find('input').val();
        let currentKodeBulan = rowNode.find('td').eq(3).text().toLowerCase();               
        let currentKeterangan = rowNode.find('td').eq(5).find('input').val();
        let nominalInput = rowNode.find('td').eq(4).find('input')[0];
        let currentNominalBayar = nominalInput ? AutoNumeric.getAutoNumericElement(nominalInput).getNumber() : '';
        kodeJenisTransaksiArray.push(currentKodeJenisTransaksi ? currentKodeJenisTransaksi : ''); 
        kodebulanArray.push(currentKodeBulan ? currentKodeBulan : ''); 
        nominalBayarArray.push(currentNominalBayar ? currentNominalBayar : '');
        keteranganArray.push(currentKeterangan ? currentKeterangan : '');
    });
    Swal.fire({
       html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53c357e2-68f2-4954-abff-939a52e6a61a/PB4F7KPq65.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Transaksi Pembayaran</h4><p class="text-muted mx-4 mb-0">Transaksi pembayaran akan dicatatakan atas Nama Siswa <strong>'+$("#nama_siswa_temp").html()+'</strong> dengan NIS <strong>'+$("#nomor_induk_siswa_temp").html()+'</strong> dengan Nominal Pembayaran sebesar <strong>Rp '+nominal_bayar_konfirmasi.getNumber().toLocaleString('id-ID')+'</strong> untuk bulan <strong>'+selectedBulan.join(', ').toUpperCase()+'</strong></p></div>',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Transaksi Sekarang',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    url: baseurlapi + '/spp/transaksispp',
                    type: 'POST',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        totalbaris: table_datatables_transaksi_spp.rows().count(),
                        id_siswa: $("#id_temp").html(),
                        nis: $("#nomor_induk_siswa_temp").html(),
                        kode_jenis_transaksi: kodeJenisTransaksiArray,
                        nominal_bayar: nominalBayarArray,
                        petugas_id: localStorage.getItem('user_id'),
                        kodebulan: convertBulanToNumeric(kodebulanArray),
                        tahun_ajaran: $("#tahun_ajaran_temp").html(),
                        nama_siswa: $("#nama_peserta_temp").html(),
                        keterangan: keteranganArray,
                        totalbelanja: nominal_bayar_konfirmasi.getNumber(),
                    },
                    success: function(response){
                        if (response.rc == 200) {
                            createToast('Informasi', 'top-right', response.message, 'success', 3000);
                            Swal.fire({
                                title: 'Konfirmasi Aksi Selanjutnya',
                                text: 'Transaksi sebelumnya berhasil disimpan, Apakah anda ingin melakukan transaksi pembayaran SPP untuk siswa yang lainnya?',
                                icon: 'success',
                                showCancelButton: true,
                                confirmButtonColor: '#dc3545',
                                cancelButtonColor: 'orange',
                                confirmButtonText: 'Ya, Transaksi Baru',
                                cancelButtonText: 'Daftar Pembayaran',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = baseurl + '/spp/transaksi_pembayaran';
                                }else{
                                    window.location.href = baseurl + '/spp/daftar_pembayaran';
                                }
                            });
                        }
                    },
                    error: function(xhr, status, error){
                        return createToast('Kesalahan Cek Data', 'top-right', xhr.responseJSON.message, 'error', 3000);
                    }
                });
            });
        }
    });
});
$("#btnLihatInformasiSiswa").on("click", function(event) {
    $("#kartu_informasi_peserta").toggle();
});