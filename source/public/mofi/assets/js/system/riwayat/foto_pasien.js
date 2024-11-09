$(document).ready(function(){
    onloadselect2();
});
function onloadselect2(){
    $.get('/generate-csrf-token', function(response) {
        $('#pencarian_member_mcu').select2({ 
            placeholder: 'Masukan informasi member seperti Nomor Identitas / Nama',
            allowClear: true,
            ajax: {
                url: baseurlapi + '/masterdata/daftarmembermcu',
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
                                text: `[${item.nomor_identitas}] - ${item.nama_peserta}`,
                                id: `${item.nomor_identitas}`,
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