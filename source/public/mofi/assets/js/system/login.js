$("#btn_login" ).on( "click", function() {
    if ($("#namapengguna").val() == "" || $("#katasandi").val() == "") return  createToast('Kesalahan Formulir','top-right', 'Nama Pengguna / Surel serta kata sandi wajib diisi sebagai data!', 'error', 3000);
    $('#btn_login').prop("disabled",true);$('#btn_login').html('<i class="fa fa-spin fa-refresh"></i> Proses Autentifikasi');
    $.get('/generate-csrf-token', function(response) {
        $.ajax({
            url: baseurlapi + '/auth/pintumasuk',
            type: 'POST',
            dataType: 'json',
            data: {
                _token: response.csrf_token,
                username: $("#namapengguna").val().trim(),
                password: $("#katasandi").val().trim(),
                access_form: "web_login",
            },
            complete: function() {
                $('#btn_login').prop("disabled", false);$('#btn_login').html('Masuk Ke Panel Beranda DocuMess');
            },
            success: function(response) {
                if (response.success == false) {
                    return createToast('Kesalahan Proses Login '+response.rc,'top-right', response.message, 'error', 3000);
                }
                localStorage.setItem('token_ajax', response.token_akses);
                window.location.href = baseurl + '/admin/beranda';
            },
            error: function(xhr, status, error) {
                $('#btn_login').prop("disabled", false);$('#btn_login').html('Masuk Ke Panel Beranda DocuMess');
                return createToast('Kesalahan Proses Login','top-right', xhr.responseJSON.message, 'error', 3000);
            }
        });
    });
});