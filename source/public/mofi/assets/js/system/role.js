let isedit = false;
$(document).ready(function () {
    tabel_role();
    tabel_role_tersedia();
});
function tabel_role_tersedia(){
    $.get('/generate-csrf-token', function(response) {
        $("#datatables_role").DataTable({
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
                "url": baseurlapi + '/role/daftarrole',
                "type": "GET",
                "beforeSend": function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                },
                "data": function(d) {
                    d._token = response.csrf_token;
                    d.parameter_pencarian = $('#kotak_pencarian_role').val();
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
                    title: "Nama Role",
                    data: "name"
                },
                {
                    title: "Hak Akses",
                    data: "permissions",
                    render(data, type, row) {
                        if (!data) {
                            return `<span class="badge bg-danger me-1">Akses Semua Fitur MCU Artha Medica</span>`;
                        }
                        return data.split(',')
                                .map(permission => `<span class="badge bg-primary me-1">${permission.trim()}</span>`)
                                .join('');
                    }
                },
                {
                    title: "Aksi",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return "<div class=\"d-flex justify-content-between gap-2\"><button class=\"btn btn-primary w-100\" onclick=\"editrole('" + row.id + "','" + row.name + "', '" + row.description + "','"+ row.group+"')\"><i class=\"fa fa-edit\"></i> Edit Role</button><button class=\"btn btn-danger w-100\" onclick=\"hapusrole('" + row.id + "','" + row.name + "', '"+row.permissions+"')\"><i class=\"fa fa-trash-o\"></i> Hapus Role</button></div>";
                        }
                        return data;
                    }
                },
            ]
        });
    }); 
}
function tabel_role(){
    $.get('/generate-csrf-token', function(response) {
        $("#datatables_permission_tersedia").DataTable({
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
                "url": baseurlapi + '/permission/daftarhakakses',
                "type": "GET",
                "beforeSend": function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                },
                "data": function(d) {
                    d._token = response.csrf_token;
                    d.parameter_pencarian = $('#kotak_pencarian').val();
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
                    title: "Group Izin",
                    data: "group",
                    visible: false
                },
                {
                    title: "Nama Perizinan",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return row.name;
                        }
                        return data;
                    }
                },
                {
                    title: "Keterangan",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            return row.description;
                        }
                        return data;
                    }
                },
                {
                    title: "Pilih Role",
                    render: function(data, type, row, meta) {
                        if (type === 'display') {
                            let buttonText = row.isSelected ? 'Jangan Pilih' : 'Pilih';
                            let buttonClass = row.isSelected ? 'btn-secondary' : 'btn-primary';
                            return '<button class="btn ' + buttonClass + ' btn-sm role-button" data-id="' + row.id + '" onclick="toggleRowSelection(this.closest(\'tr\'))">' +
                                buttonText +
                                '</button><input type="checkbox" class="form-check-input group-' + row.group + '" id="checkbox_'+row.id+'" name="checkbox_roles[]" onclick="toggleRowSelection(this.closest(\'tr\'))" style="display:none;">';
                        }
                        return data;
                    }
                }
            ],
            rowGroup: {
                dataSrc: 'group',
                startRender: function(rows, group) {
                    return $('<tr>')
                        .append('<td colspan="4">' + group + '</td>');
                }
            },
            drawCallback: function(settings) {
                let api = this.api();
                let rows = api.rows({page: 'current'}).nodes();
                let last = null;

                api.column(0, {page: 'current'}).data().each(function(group, i) {
                    if (last !== group) {
                        $(rows).eq(i).before(
                            '<tr class="group">' +
                                '<td colspan="1"><strong>Kelompok Izin</strong></td>' +
                                '<td colspan="1"><strong>' + group + '</strong></td>' +
                                '<td colspan="1">' +
                                    '<button class="btn btn-primary btn-sm" onclick="selectAllInGroup(\'' + group + '\')">Pilih Grup '+group+'</button>' +
                                '</td>' +
                            '</tr>'
                        );
                        last = group;
                    }
                });
            }
        });
    });
}
$('#kotak_pencarian').on('input', debounce(function() {
  $("#datatables_permission_tersedia").DataTable().ajax.reload();
}, 500));
$('#kotak_pencarian_role').on('input', debounce(function() {
  $("#datatables_role").DataTable().ajax.reload();
}, 500));
$('#tambah_role_baru').on('click', function() {
    isedit = false;
    $("#nama_role").val("");
    $("#keterangan_role").val("");
    uncheckall_datatables_permission_tersedia();
});
$('#simpan_role').on('click', function() {
    if ($("#nama_role").val() == "" || $("#keterangan_role").val() == "") {
        return createToast('Kesalahan Formulir','top-right', 'Silahkan isi nama role dan keterangan role terlebih dahulu jikalau ingin membuat role baru.', 'error', 3000);
    }
    let checkedCheckboxes = $('#datatables_permission_tersedia').find('input[type="checkbox"]:checked');
    if (checkedCheckboxes.length === 0 && $("#nama_role").val() !== "Super Admin") {
        return createToast('Kesalahan Pemilihan', 'top-right', 'Silakan pilih setidaknya satu hak akses untuk role ini.', 'error', 3000);
    }
    $("#simpan_role").html('<i class="fa fa-spinner fa-spin"></i> Sedang Menyimpan Data');
    let selectedPermissions = [];
    checkedCheckboxes.each(function() {
        selectedPermissions.push(
            $(this).closest('tr').find('td:first').text().trim()
        );
    });
    $.ajax({
        url: baseurlapi + (isedit ? '/role/editrole' : '/role/tambahrole'),
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
        },
        method: 'POST',
        data: {
            idrole: isedit ? $("#id_role").val() : "",
            name: $("#nama_role").val(),
            description: $("#keterangan_role").val(),
            permissions: selectedPermissions
        },
        success: function(response) {
            $("#nama_role").val("");
            $("#keterangan_role").val("");
            uncheckall_datatables_permission_tersedia();
            createToast('Sukses', 'top-right', 'Role berhasil disimpan. Silahkan lakukan masuk ulang ke sistem untuk melihat role yang baru saja dibuat kepada pengguna terkait.', 'success', 3000);
            $("#datatables_role").DataTable().ajax.reload();
            $("#simpan_role").html('<i class="fa fa-save"></i> Simpan Data');
            isedit = false;
        },
        error: function(xhr, status, error) {
            createToast('Error', 'top-right', xhr.responseJSON.message, 'error', 3000);
            $("#simpan_role").html('<i class="fa fa-save"></i> Simpan Data');
        }
    });
});
function hapusrole(idrole,namarole, hakaskes){
    if (idrole == "") {
        return createToast('Kesalahan Formulir','top-right', 'Silahkan tentukan ID Role untuk melakukan penghapusan role.', 'error', 3000);
    }  
    isedit = false;
    Swal.fire({ 
        html: '<div class="mt-3"><lord-icon src="https://cdn.lordicon.com/gsqxdxog.json" trigger="loop" colors="primary:#f06548,secondary:#f7b84b" style="width:120px;height:120px"></lord-icon><div class="pt-2 fs-15"><h4>Konfirmasi Hapus Role '+namarole+'</h4><p class="text-muted mx-4 mb-0">Seluruh role '+hakaskes+' akan dihapus, pastikan anda telah mengubah role pengguna yang terkait dengan role ini menjadi role lainnya</p></div></div>',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'orange',
        confirmButtonText: 'Hapus Informasi',
        cancelButtonText: 'Nanti Dulu!!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: baseurlapi + '/role/hapusrole',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
                },
                method: 'GET',
                data: {
                    idrole: idrole,
                    namarole: namarole,
                },
                success: function(response) {
                    createToast('Sukses', 'top-right', 'Role berhasil dihapus', 'success', 3000);
                    $("#datatables_role").DataTable().ajax.reload();
                },
                error: function(xhr, status, error) {
                    createToast('Error', 'top-right', 'Terjadi kesalahan saat menghapus role', 'error', 3000);
                }
            });
        }
    });
}
function uncheckall_datatables_permission_tersedia(){
    $('#datatables_permission_tersedia tbody tr').each(function() {
        let row = $(this);
        row.removeClass('selected');
        let button = row.find('.role-button');
        let checkbox = row.find('input[type="checkbox"]');
        button.text('Pilih').removeClass('btn-secondary').addClass('btn-primary');
        checkbox.prop('checked', false);
        row.css({
            'background-color': '',
            'color': '#3D434A'
        }).find('td:not(:has(button))').css('color', '#3D434A');
    });
}
function toggleRowSelection(row) {
    $(row).toggleClass('selected');
    let button = $(row).find('.role-button');
    let checkbox = $(row).find('input[type="checkbox"]');
    if ($(row).hasClass('selected')) {
        button.text('Jangan Pilih').removeClass('btn-primary').addClass('btn-secondary');
        checkbox.prop('checked', true);
        $(row).css({
            'background-color': 'orange',
            'color': 'white'
        }).find('*').css('color', 'white');
    } else {
        button.text('Pilih').removeClass('btn-secondary').addClass('btn-primary');
        checkbox.prop('checked', false);
        $(row).css({
            'background-color': '',
            'color': '#3D434A'
        }).find('td:not(:has(button))').css('color', '#3D434A');
    }
}

$('#tabel-role tbody').on('click', 'tr', function() {
    toggleRowSelection(this);
});

$('#tabel-role tbody').on('click', '.role-button', function(e) {
    e.stopPropagation();
    toggleRowSelection($(this).closest('tr'));
});

function selectAllInGroup(group) {
    let allSelected = true;
    $('.group-' + group).each(function() {
        let row = $(this).closest('tr');
        if (!row.hasClass('selected')) {
            allSelected = false;
            return false;
        }
    });
    $('.group-' + group).each(function() {
        let row = $(this).closest('tr');
        if (allSelected) {
            if (row.hasClass('selected')) {
                toggleRowSelection(row);
            }
        } else {
            if (!row.hasClass('selected')) {
                toggleRowSelection(row);
            }
        }
    });
}
function editrole(idrole, namarole, keteranganrole, group){
    $("#id_role").val(idrole);
    $("#nama_role").val(namarole);
    $("#keterangan_role").val(keteranganrole);
    uncheckall_datatables_permission_tersedia();
    isedit = true;
    $.ajax({
        url: baseurlapi + '/role/detailrole',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token_ajax'));
        },
        method: 'GET',
        data: {
            idrole: idrole
        },
        success: function(response) {
           let data = response.data;
           let permissions = data.permissions;
           permissions.forEach(function(permission) {
            $('#datatables_permission_tersedia tbody tr').each(function() {
                let row = $(this);
                if (row.find('td:first').text().trim() === permission.name) {
                    toggleRowSelection(row);
                }
            });
           });
        },
    });
}   