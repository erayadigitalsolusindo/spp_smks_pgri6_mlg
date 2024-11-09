<?php

return [

    /*
    |--------------------------------------------------------------------------
    | REST API Error Response Codes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to define informative error messages
    | for various REST API response status codes. You can modify these messages
    | to better suit your application's needs.
    |
    */
  
    // Klien Error (4xx)
    '400_error' => 'Permintaan tidak valid. Periksa format data dan coba lagi.',
    '401_error' => 'Tidak terautentikasi. Token hilang atau tidak valid.',
    '403_error' => 'Akses ditolak. Anda tidak memiliki izin untuk mengakses sumber daya ini.',
    '404_error' => 'Sumber daya tidak ditemukan. Periksa kembali endpoint yang Anda panggil.',
    '404_error_web' => 'Data tidak ditemukan. Pesan Kesalahan : :pesankesalahan',
    '405_error' => 'Metode HTTP tidak didukung. Gunakan metode yang valid untuk endpoint ini.',
    '409_error' => 'Terjadi konflik data. Data yang akan dibuat sudah ada.',
    '413_error' => 'Ukuran data yang dikirimkan terlalu besar. Kurangi ukuran data atau hubungi administrator.',
    '422_error' => 'Data tidak valid. Periksa kembali format data yang dikirimkan.',
  
    // Server Error (5xx)
    '500_error' => 'Kesalahan internal server. Tim kami sedang menangani masalah ini',
    '502_error' => 'Respon server lain tidak valid. Silahkan coba lagi nanti.',
    '503_error' => 'Server sedang sibuk. Coba lagi beberapa saat lagi.',
    '504_error' => 'Server menunggu respon dari server lain terlalu lama. Silahkan coba lagi nanti.',

    '700_error' => 'Informasi dari data ini tidak bisa diubah atau dihapus. Karena sistem dari DocuMess membutuhkan data ini',
    '701_error_mail' => 'Kesalahan dalam memproses lupa kata sandi. Token anda sudah kadaluarsa. Silahkan melakukan permintaan lagi',
  
  ];  