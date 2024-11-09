<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisPembayaran extends Model
{
    protected $table = 'transaksi_jenis_trx';
    protected $fillable = [
        'jenis_pembayaran',
        'nominal',
    ];
    public $timestamps = false; 
}
