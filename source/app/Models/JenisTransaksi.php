<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisTransaksi extends Model
{
    protected $table = 'transaksi_jenis_trx';
    protected $fillable = [
        'kode',
        'jenis_transaksi',
        'jenis'
    ];
    public $timestamps = false; 
}
