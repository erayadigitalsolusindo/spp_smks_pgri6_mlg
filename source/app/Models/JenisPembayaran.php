<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class JenisPembayaran extends Model
{
    protected $table = 'transaksi_jenis_trx';
    protected $fillable = [
        'jenis_pembayaran',
        'nominal',
    ];
    public $timestamps = false; 
    public static function getjenispembayarantabel($req, $perHalaman, $offset){
        $parameterpencarian = $req->parameter_pencarian;
        $tablePrefix = config('database.connections.mysql.prefix');
        $query = DB::table((new self())->getTable());
        if (!empty($parameterpencarian)) {
            $query->where('kode', 'LIKE', '%' . $parameterpencarian . '%')
                  ->orWhere('jenis_transaksi', 'LIKE', '%' . $parameterpencarian . '%');
        }
        $jumlahdata = $query->count();
        $result = $query->take($perHalaman)
            ->skip($offset)
            ->orderBy('jenis_transaksi', 'ASC')
            ->get();
        return [
            'data' => $result,
            'total' => $jumlahdata
        ];

    }
}
