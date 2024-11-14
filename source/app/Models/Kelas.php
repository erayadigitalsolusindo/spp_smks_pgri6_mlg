<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    protected $table = 'atr_kelas';
    protected $fillable = ['tingkat_kelas', 'group_kelas'];
    public $timestamps = false;
}
