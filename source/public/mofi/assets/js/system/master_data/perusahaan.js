let form = $('#formulir_tambah_perusahaan_baru');let isedit = false;let id_perusahaan = "";
let quill = null;
$(document).ready(function(){
    dafatarperusahaan();
    quill = new Quill('#keteranganperusahaan', {
        theme: 'snow',
    });
});
function dafatarperusahaan(){
    $.get('/generate-csrf-token', function(response){
        $("#datatables_perusahaan").DataTable({
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
                "url": baseurlapi + '/masterdata/daftarperusahaan',
                "type": "GET",
                "beforeSend": function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                },
                "data": function(d) {
                    d._token = response.csrf_token;
                    d.parameter_pencarian = $('#kotak_pencarian_perusahaan').val();
                    d.start = 0;
                    d.length = 10;
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
                {
                    title: "No",
                    render: function(data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {
                    title: "Kode Perusahaan",
                    data: "company_code"
                },
                {
                    title: "Nama Perusahaan",
                    data: "company_name"
                },
                {
                    title: "Alamat Perusahaan",
                    data: "alamat"
                },
                {
                    title: "Keterangan Perusahaan",
                    data: "keterangan"
                },
                {
                    title: "Aksi",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return "<div class=\"d-flex justify-content-between gap-2\"><button class=\"btn btn-primary w-100\" onclick=\"detailperusahaan('" + row.id + "','" + row.company_code + "', '" + row.company_name + "', '"+row.alamat+"', '"+encodeURIComponent(row.keterangan)+"')\"><i class=\"fa fa-edit\"></i> Edit Perusahaan</button><button class=\"btn btn-danger w-100\" onclick=\"hapusperusahaan('" + row.id + "','" + row.company_code + "', '" + row.company_name + "')\"><i class=\"fa fa-trash-o\"></i> Hapus Perusahaan</button></div>";
                        }
                        return data;
                    }
                },
            ]
        });
    });
}
$('#kotak_pencarian_perusahaan').on('keyup', debounce(function(){
    $('#datatables_perusahaan').DataTable().ajax.reload();
}, 300));
$('#tambah_perusahaan_baru').click(function(){
    isedit = false;
    $('#formulir_tambah_perusahaan').modal('show');
});
$('#simpan_perusahaan').click(function(event){
    event.preventDefault();
    form.addClass('was-validated');
    if ($('#kodeperusahaan').val() == "" || $('#namaperusahaan').val() == "" || $('#alamatperusahaan').val() == "" ) {
        return createToast('Kesalahan Formulir','top-right', 'Silahkan isi semua field pada formulir terlebih dahulu untuk menyimpan informasi perusahaan.', 'error', 3000);
    }
    Swal.fire({
        html: '<div class="mt-3 text-center"><dotlottie-player src="https://lottie.host/53c357e2-68f2-4954-abff-939a52e6a61a/PB4F7KPq65.json" background="transparent" speed="1" style="width:150px;height:150px;margin:0 auto" direction="1" playMode="normal" loop autoplay></dotlottie-player><div><h4>Konfirmasi Penyimpanan Data Perusahaan</h4><p class="text-muted mx-4 mb-0">Apakah anda yakin ingin menyimpan informasi perusahaan <strong>'+$(namaperusahaan).val()+'</strong> ?. Jika sudah silahkan tentukan paket MCU atas perusahaan ini jika berkeinginan.</p></div></div>',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Simpan Data',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                    url: baseurlapi + '/masterdata/' + (isedit ? 'ubahperusahaan' : 'simpanperusahaan'),
                    type: 'POST',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                    },
                    data: {
                        _token: response.csrf_token,
                        id: isedit ? id_perusahaan : "",
                        company_code: $('#kodeperusahaan').val(),
                        company_name: $('#namaperusahaan').val(),
                        alamat: $('#alamatperusahaan').val(),
                        keterangan: quill.root.innerHTML.trim(),
                    },
                    success: function(response){
                        $("#datatables_perusahaan").DataTable().ajax.reload();
                        clearformperusahaan()
                        $('#formulir_tambah_perusahaan').modal('hide');
                        return createToast('Informasi Perusahaan', 'top-right', response.message, 'success', 3000);
                    },
                    error: function(xhr, status, error){
                        return createToast('Error', 'top-right', xhr.responseJSON.message, 'error', 3000);
                    }
                });
            });
        }
    });
});
function detailperusahaan(id, kode, nama, alamat, keterangan){
    id_perusahaan = id;
    isedit = true;
    $('#kodeperusahaan').val(kode);
    $('#namaperusahaan').val(nama);
    $('#alamatperusahaan').val(alamat);
    quill.container.firstChild.innerHTML = decodeURIComponent(keterangan);
    $('#formulir_tambah_perusahaan').modal('show');
}
function clearformperusahaan(){
    form.removeClass('was-validated');
    id_perusahaan = "";
    $('#kodeperusahaan').val("");
    $('#namaperusahaan').val("");
    $('#alamatperusahaan').val("");
    quill.setContents([{
        insert: ''
    }]);
}
function hapusperusahaan(id, kode, nama){
    if (id == "") {
        return createToast('Kesalahan Formulir','top-right', 'Silahkan tentukan ID Perusahaan untuk melakukan penghapusan perusahaan.', 'error', 3000);
    }
    Swal.fire({
        html: '<div class="mt-3"><lord-icon src="https://cdn.lordicon.com/gsqxdxog.json" trigger="loop" colors="primary:#f06548,secondary:#f7b84b" style="width:120px;height:120px"></lord-icon><div class="pt-2 fs-15"><h4>Konfirmasi Hapus Perusahaan '+nama+'</h4><p class="text-muted mx-4 mb-0">Seluruh data yang terkait dengan perusahaan ini akan dihapus secara permanen. Pastikan tidak ada informasi data yang terkait dengan perusahaan ini.</p></div></div>',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Hapus Informasi',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/generate-csrf-token', function(response){
                $.ajax({
                url: baseurlapi + '/masterdata/hapusperusahaan',
                type: 'GET',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                },
                data: {
                    _token: response.csrf_token,
                    id: id,
                    nama: nama
                },
                success: function(response){
                    $("#datatables_perusahaan").DataTable().ajax.reload();
                    clearformperusahaan()
                    return createToast('Informasi Perusahaan', 'top-right', response.message, 'success', 3000);
                },
                error: function(xhr, status, error){
                    return createToast('Error', 'top-right', xhr.responseJSON.message, 'error', 3000);
                }
                });
            });
        }
    });   
}