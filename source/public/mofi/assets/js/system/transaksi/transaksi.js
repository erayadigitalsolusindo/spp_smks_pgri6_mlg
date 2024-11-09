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
        maxDate: moment().subtract(15, 'years').format('DD-MM-YYYY'),
    });
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
    $('#nama_peserta_temp').text(data.nama_siswa);
    $('#nomor_induk_siswa_temp').text(data.nis);
    $('#nama_siswa_temp').text(data.nama_siswa); 
    $('#jenis_kelamin_temp').text(data.jenis_kelamin);
    $('#alamat_temp').text(data.alamat_siswa);
    $('#no_telepon_temp').text(data.no_telepon);
    $('#email_temp').text(data.email);
    $('#kelas_temp').text(data.tingkatan_kelas+' '+data.nama_jurusan);
    $('#tahun_ajaran_temp').text(data.tahun_ajaran);
});
$('#select_jenis_pembayaran_transaksi_spp').on('select2:select', function(e) {
    nominal_pembayaran_transaksi_spp.set(0);
    $('#nominal_pembayaran_transaksi_spp').focus();
});
function tambah_baris_transaksi_spp() {
    if (nominal_pembayaran_transaksi_spp.getNumber() == 0) {
        return createToast('Informasi', 'top-right', 'Nominal Pembayaran tidak boleh 0', 'error', 3000);
    }
    if ($('#select_jenis_pembayaran_transaksi_spp').val() == null) {
        return createToast('Informasi', 'top-right', 'Jenis Pembayaran tidak boleh kosong', 'error', 3000);
    }

    let selectedBulan = [];
    $('#juli, #agustus, #september, #oktober, #november, #desember, #januari, #februari, #maret, #april, #mei, #juni').each(function() {
        if ($(this).is(":checked")) {
            selectedBulan.push($(this).attr('id'));
        }
    });

    let jenisPembayaranValue = $('#select_jenis_pembayaran_transaksi_spp').val();
    let jenisPembayaranText = $('#select_jenis_pembayaran_transaksi_spp option:selected').text().split('-')[1].trim();
    let nominalPembayaran = nominal_pembayaran_transaksi_spp.getNumber();

    let found = false;
    table_datatables_transaksi_spp.rows().every(function(rowIdx, tableLoop, rowLoop) {
        let row = this.node();
        let currentJenisPembayaran = $(row).find('input.form-control').first().val();
        let currentBulan = $(row).find('span.badge').map(function() {
            return $(this).text().toLowerCase();
        }).get();
        if (currentJenisPembayaran === jenisPembayaranValue) {
            let currentNominalPembayaran = AutoNumeric.getAutoNumericElement($(row).find('.nominal_pembayaran')[0]);
            currentNominalPembayaran.set(currentNominalPembayaran.getNumber() + nominalPembayaran);
            found = true;
            return false;
        }
    });
    if (!found) {
        table_datatables_transaksi_spp.row.add([
            '',
            `<input readonly style="background-color: transparent;border: none;" type="text" class="form-control" value="${jenisPembayaranValue}">`,
            `<input readonly style="background-color: transparent;border: none;" type="text" class="form-control" value="${jenisPembayaranText}">`,
            selectedBulan.map(bulan => `<span class="badge badge-primary me-1" style="text-transform: capitalize">${bulan}</span>`).join(''),
            `<input style="background-color: transparent;border: none;" type="text" class="form-control nominal_pembayaran" value="${nominalPembayaran}" placeholder="0.00">`,
            `<button class="hapus_baris btn btn-danger w-100"><i class="fa fa-trash"></i> Hapus</button>`,
        ]).draw();
    }
    updateNomorUrut();
    initializeAutoNumeric();
    scrollToLastRow();
    updateGrandTotal();
}


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

