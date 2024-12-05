let tagihan_juli = new AutoNumeric('#tagihan_juli', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let tagihan_agustus = new AutoNumeric('#tagihan_agustus', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let tagihan_september = new AutoNumeric('#tagihan_september', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let tagihan_oktober = new AutoNumeric('#tagihan_oktober', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let tagihan_november = new AutoNumeric('#tagihan_november', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let tagihan_desember = new AutoNumeric('#tagihan_desember', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let tagihan_januari = new AutoNumeric('#tagihan_januari', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let tagihan_februari = new AutoNumeric('#tagihan_febuari', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let tagihan_maret = new AutoNumeric('#tagihan_maret', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let tagihan_april = new AutoNumeric('#tagihan_april', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let tagihan_mei = new AutoNumeric('#tagihan_mei', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let tagihan_juni = new AutoNumeric('#tagihan_juni', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let juli = new AutoNumeric('#juli', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let agustus = new AutoNumeric('#agustus', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let september = new AutoNumeric('#september', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let oktober = new AutoNumeric('#oktober', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let november = new AutoNumeric('#november', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let desember = new AutoNumeric('#desember', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let januari = new AutoNumeric('#januari', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let februari = new AutoNumeric('#febuari', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let maret = new AutoNumeric('#maret', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let april = new AutoNumeric('#april', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let mei = new AutoNumeric('#mei', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let juni = new AutoNumeric('#juni', {decimal: ',', digit: '.', allowDecimalPadding: false, minimumValue: '0', modifyValueOnUpDownArrow: false, modifyValueOnWheel: false});
let datatables_tagihan_siswa;

$(document).ready(function() {
    setTimeout(function() {
        tabel_datatagihan();
    }, 500);
});
function tabel_datatagihan() {
    $.get('/generate-csrf-token', function(response) {
        $("#datatables_tagihan").DataTable({
            searching: false,
            lengthChange: false,
            ordering: false,
            pagingType: "full_numbers",
            scrollX: true,
            serverSide: true,
            language: {
                paginate: {
                    first: '<i class="fa fa-angle-double-left"></i>',
                    last: '<i class="fa fa-angle-double-right"></i>',
                    next: '<i class="fa fa-angle-right"></i>',
                    previous: '<i class="fa fa-angle-left"></i>',
                }
            },
            ajax: {
                url: baseurlapi + '/spp/daftar_tagihan',
                type: "GET",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                },
                data: function(d) {
                    d._token = response.csrf_token;
                    d.kelas_terpilih = $("#filter_tingkat_kelas_tagihan").val();
                    d.parameter_pencarian = $("#kotak_pencarian_tagihan").val();
                    d.tahun_ajaran_terpilih = $("#filter_tahun_ajaran_tagihan").val();
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
                { 
                    title: "Aksi", 
                    className: "dtfc-fixed-right_header text-center", 
                    render: (data, type, row) => `
                        <div class="d-flex justify-content-between gap-2 background_fixed_right_row">
                            <button class="btn btn-primary w-100" onclick="editdaftartagihan('${row.id_siswa}')">
                                <i class="fa fa-edit"></i></button>
                            <button class="btn btn-danger w-100" onclick="hapustagihanpeserta('${row.id_siswa}', '${row.nama_bank}')">
                                <i class="fa fa-trash-o"></i></button>
                        </div>`
                },
                { 
                    title: "Informasi Informasi Siswa",  
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return `NIS : ${row.nis}<br>Nama : ${row.nama_siswa}<br>Kelas : ${row.tingkat_kelas} - ${row.tahun_ajaran}`
                        }       
                        return data;
                    } 
                },
                ...["juli", "agustus", "september", "oktober", "november", "desember", "januari", "februari", "maret", "april", "mei", "juni"].flatMap(month => [
                    { 
                        title:`${month.charAt(0).toUpperCase() + month.slice(1)}`, 
                        className: "text-center", 
                        render: (data, type, row) => `<div class="text-center">${row[month] === 0 ? '<span class="text-danger">LUNAS</span>' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row[month])}</div>`
                    }
                ])
            ]
        });
    });
}
$("#proses_tagihan").on("click", function() {
    $("#datatables_tagihan").DataTable().ajax.reload();
});
$("#kotak_pencarian_tagihan").on("keyup change", debounce(function() {
   $("#datatables_tagihan").DataTable().ajax.reload();
}, 500));
function hapustagihanpeserta(idpeserta, nama_peserta){
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53a48ece-27d3-4b85-9150-8005e7c27aa4/usrEqiqrei.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Penghapusan Data Tegihan '+nama_peserta+'</h4><p class="text-muted mx-4 mb-0">Apakah anda yakin ingin menghapus informasi tagihan peserta <strong>'+nama_peserta+'</strong> dengan ID <strong>'+idpeserta+'</strong> ? Informasi peserta yang terkait dengan siswa yang dihapus tidak akan hilang, tetapi tidak akan dimunculin secara visual pada aplikasi ini termasuk LAPORAN',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Hapus Data',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    url: baseurlapi + '/masterdata/hapustagihanpeserta',
                    type: 'GET',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        idpeserta: idpeserta,
                        nama_peserta: nama_peserta,
                    },
                    success: function(response) {
                        $("#datatables_tagihan").DataTable().ajax.reload();
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
function editdaftartagihan(id_siswa){
    $.get('/generate-csrf-token', function(response){
        $.ajax({
            url: baseurlapi + '/spp/editdaftartagihan',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
            },
            data: {
                _token: response.csrf_token,
                id_siswa: id_siswa,
            },
            success: function(response) {
                $("#nama_siswa_tagihan").html(response.data.nama_siswa);
                $("#id_siswa_tagihan").html(response.data.id);
                tagihan_juli.set(response.data.total_tagihan_juli);
                tagihan_agustus.set(response.data.total_tagihan_agustus);
                tagihan_september.set(response.data.total_tagihan_september);
                tagihan_oktober.set(response.data.total_tagihan_oktober);
                tagihan_november.set(response.data.total_tagihan_november);
                tagihan_desember.set(response.data.total_tagihan_desember);
                tagihan_januari.set(response.data.total_tagihan_januari);
                tagihan_februari.set(response.data.total_tagihan_februari);
                tagihan_maret.set(response.data.total_tagihan_maret);
                tagihan_april.set(response.data.total_tagihan_april);
                tagihan_mei.set(response.data.total_tagihan_mei);
                tagihan_juni.set(response.data.total_tagihan_juni);
                juli.set(response.data.juli);
                agustus.set(response.data.agustus);
                september.set(response.data.september);
                oktober.set(response.data.oktober);
                november.set(response.data.november);
                desember.set(response.data.desember);
                januari.set(response.data.januari);
                februari.set(response.data.februari);
                maret.set(response.data.maret);
                april.set(response.data.april);
                mei.set(response.data.mei);
                juni.set(response.data.juni);
                $("#form_edit_tagihan").modal("show");
            },
            error: function(xhr, status, error) {
                createToast('Kesalahan Edit Data', 'top-right', error, 'error', 3000);
            }
        });
    });

}
function simpan_tagihan_siswa_update(){
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53c357e2-68f2-4954-abff-939a52e6a61a/PB4F7KPq65.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Pembaruan Tagihan</h4><p class="text-muted mx-4 mb-0">Tagihan atas Nama Siswa <strong>'+$("#nama_siswa_tagihan").html()+'</strong> dengan NIS <strong>'+$("#nomor_induk_siswa_tagihan").html()+'</strong> akan diperbarui dengan data tagihan sebagai daftar pada formulir. Apakah anda yakin ingin melanjutkan proses pembaruan tagihan ini?</p></div>',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Pembaruan Sekarang',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    url: baseurlapi + '/spp/updatetagihan',
                    type: 'POST',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        id_siswa: $("#id_siswa_tagihan").html(),
                        tagihan_juli: tagihan_juli.getNumber(),
                        tagihan_agustus: tagihan_agustus.getNumber(),
                        tagihan_september: tagihan_september.getNumber(),
                        tagihan_oktober: tagihan_oktober.getNumber(),
                        tagihan_november: tagihan_november.getNumber(),
                        tagihan_desember: tagihan_desember.getNumber(),
                        tagihan_januari: tagihan_januari.getNumber(),
                        tagihan_februari: tagihan_februari.getNumber(),
                        tagihan_maret: tagihan_maret.getNumber(),
                        tagihan_april: tagihan_april.getNumber(),
                        tagihan_mei: tagihan_mei.getNumber(),
                        tagihan_juni: tagihan_juni.getNumber(),
                        juli: juli.getNumber(),
                        agustus: agustus.getNumber(),
                        september: september.getNumber(),
                        oktober: oktober.getNumber(),
                        november: november.getNumber(),
                        desember: desember.getNumber(),
                        januari: januari.getNumber(),
                        februari: februari.getNumber(),
                        maret: maret.getNumber(),
                        april: april.getNumber(),
                        mei: mei.getNumber(),
                        juni: juni.getNumber(),
                    },
                    success: function(response) {
                        createToast('Informasi', 'top-right', response.message, 'success', 3000);
                        $("#datatables_tagihan").DataTable().ajax.reload();
                        $("#form_edit_tagihan").modal("hide");
                    },
                    error: function(xhr, status, error) {
                        createToast('Kesalahan Pembaruan Tagihan', 'top-right', error, 'error', 3000);
                    }
                });
            });
        }
    });
}   
datatables_tagihan_siswa = $('#datatables_tagihan_siswa').DataTable({
    searching: false,
    lengthChange: false,
    ordering: false,
    bFilter: false,
    bInfo: false,
    paging: false,
    keys:true,
}).on('key-focus', function ( e, datatable, cell, originalEvent ) {
    $('input', cell.node()).focus();
}).on("focus", "td input", function(){
    $(this).select();
}) 
datatables_tagihan_siswa.on('key', function (e, dt, code) {
    var scrollArea = $('.dataTables_scrollBody');
    if (code === 13) {
        datatables_tagihan_siswa.keys.move('down');
    } else if (code === 37) {   
        scrollArea.animate({
            scrollLeft: scrollArea.scrollLeft() - 200
        }, 300);
    } else if (code === 39) {
        scrollArea.animate({
            scrollLeft: scrollArea.scrollLeft() + 200
        }, 300);
    }
});
let copiedText = "";
datatables_tagihan_siswa.on('key-focus', function (e, datatable, cell) {
    const inputElement = $('input', cell.node());
    inputElement.on('copy', function (e) {
        e.preventDefault();  
        const autoNumericInstance = AutoNumeric.getAutoNumericElement(this);
        copiedText = autoNumericInstance.getNumericString();
        e.originalEvent.clipboardData.setData('text/plain', copiedText);
    });
    inputElement.on('paste', function (e) {
        e.preventDefault();
        let pastedValue;
        if (copiedText !== "" || copiedText !== null || copiedText !== undefined) {
            pastedValue = copiedText;
        } else {
            pastedValue = (e.originalEvent.clipboardData || window.clipboardData).getData('text/plain');
        }
        const formattedValue = pastedValue.replace(/[^0-9.-]/g, '');
        const autoNumericInstance = AutoNumeric.getAutoNumericElement(this);
        autoNumericInstance.set(formattedValue);
    });
});

    