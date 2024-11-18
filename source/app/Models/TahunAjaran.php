<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TahunAjaran extends Model
{
    protected $table = 'siswa_tahun_ajaran';
    protected $fillable = ['id_tahun_ajaran','tahun_ajaran'];
    public $timestamps = false;
}
