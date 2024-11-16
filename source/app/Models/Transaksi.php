<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Transaksi extends Model
{
    protected $table = 'transaksi';
    protected $fillable = [
        'no_transaksi',
        'nis',
        'tanggal',
        'nominal',
        'petugas',
        'total_transaksi_bayar',
        'tahun_ajaran',
        'metode_pembayaran',
        'nominal_bayar',
        'no_transaksi_transfer'
    ];
    public $timestamps = false;
}
