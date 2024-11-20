<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class TagihanNonBulanan extends Model
{
    protected $table = 'siswa_tagihan_dinamis';
    protected $fillable = [
        'id_siswa',
        'kode_jenis_transaksi',
        'qty', 
        'nominal',
        'sisa_nominal', 
        'id_tahun_ajaran'
    ];
    public $timestamps = false;
    public static function simpanTagihanNonBulanan($req) {
        $bulkInsertData = [];
        foreach ($req->rowsData as $row) {
            $bulkInsertData[] = [
                'id_siswa' => $row['id_siswa'],
                'kode_jenis_transaksi' => $row['kode_jenis_transaksi'],
                'qty' => $row['qty'],
                'nominal' => $row['nominal'],
                'sisa_nominal' => $row['nominal'],
                'id_tahun_ajaran' => $row['id_tahun_ajaran'],
            ];
        }
        $nisList = array_column($bulkInsertData, 'id_siswa');
        $tahunAjaran = $bulkInsertData[0]['id_tahun_ajaran'];
        $existingData = TagihanNonBulanan::whereIn('id_siswa', $nisList)
            ->where('id_tahun_ajaran', $tahunAjaran)
            ->get()
            ->keyBy('id_siswa');
        $newData = [];
        $updateData = [];
        foreach ($bulkInsertData as $data) {
            if (isset($existingData[$data['id_siswa']])) {
                $updateData[] = [
                    'id_siswa' => $data['id_siswa'],
                    'id_tahun_ajaran' => $data['id_tahun_ajaran'],
                    'kode_jenis_transaksi' => $data['kode_jenis_transaksi'],
                    'qty' => $data['qty'],
                    'nominal' => $data['nominal'],
                ];
            } else {
                $newData[] = $data;
            }
        }
        if (!empty($newData)) {
            TagihanNonBulanan::insert($bulkInsertData);
        }
        if (!empty($updateData)) {
            $updateDataSql = [
                'kode_jenis_transaksi' => [],
                'qty' => [],
                'nominal' => []
            ];
            foreach ($updateData as $data) {
                $updateDataSql['kode_jenis_transaksi'][] = "WHEN id_siswa = {$data['id_siswa']} AND id_tahun_ajaran = {$data['id_tahun_ajaran']} THEN '{$data['kode_jenis_transaksi']}'";
                $updateDataSql['qty'][] = "WHEN id_siswa = {$data['id_siswa']} AND id_tahun_ajaran = {$data['id_tahun_ajaran']} THEN {$data['qty']}";
                $updateDataSql['nominal'][] = "WHEN id_siswa = {$data['id_siswa']} AND id_tahun_ajaran = {$data['id_tahun_ajaran']} THEN {$data['nominal']}";
            }
            $updateQuery = "UPDATE eds_siswa_tagihan_dinamis SET 
                kode_jenis_transaksi = CASE " . implode(' ', $updateDataSql['kode_jenis_transaksi']) . " END,
                qty = CASE " . implode(' ', $updateDataSql['qty']) . " END,
                nominal = CASE " . implode(' ', $updateDataSql['nominal']) . " END
                WHERE id_siswa IN (" . implode(',', array_column($updateData, 'id_siswa')) . ") 
                AND id_tahun_ajaran = {$updateData[0]['id_tahun_ajaran']}";
            DB::statement($updateQuery);
        }
    }
    public static function listTagihanTabel($req, $perHalaman, $offset)
    {
        $parameterpencarian = $req->parameter_pencarian;
        $kelas_terpilih = $req->kelas_terpilih;
        $tahun_ajaran_terpilih = $req->tahun_ajaran_terpilih;
        $query = DB::table((new self())->getTable())
        ->join('siswa_buku_induk', 'siswa_buku_induk.id', '=', 'siswa_tagihan_dinamis.id_siswa')
        ->join('transaksi_jenis_trx', 'transaksi_jenis_trx.kode', '=', 'siswa_tagihan_dinamis.kode_jenis_transaksi')
        ->join('atr_kelas', 'atr_kelas.id', '=', 'siswa_buku_induk.id_kelas')
        ->select('transaksi_jenis_trx.*','siswa_buku_induk.id as id_siswa', 'siswa_tagihan_dinamis.*', 'siswa_buku_induk.nis', 'siswa_buku_induk.nama_siswa', 'atr_kelas.tingkat_kelas');
        if (!empty($kelas_terpilih)) {
            $query->where('atr_kelas.id', $kelas_terpilih);
        }else{
            $query->where(function($q) use ($parameterpencarian) {
                $q->where('siswa_buku_induk.nis', 'LIKE', '%' . $parameterpencarian . '%')
                  ->orWhere('siswa_buku_induk.nama_siswa', 'LIKE', '%' . $parameterpencarian . '%');
            })->where('siswa_tagihan_dinamis.id_tahun_ajaran','LIKE','%' . $tahun_ajaran_terpilih. '%');
        }
        $jumlahdata = $query->count();
        $result = $query->take($perHalaman)
            ->skip($offset)
            ->orderBy('siswa_buku_induk.nis', 'ASC')
            ->get();
        return [
            'data' => $result,
            'total' => $jumlahdata
        ];
    }
}
