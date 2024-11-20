<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
class Tagihan extends Model
{
    protected $table = 'siswa_tagihan';

    protected $fillable = [
        'nis',
        'juli',
        'total_tagihan_juli',
        'agustus',
        'total_tagihan_agustus',
        'september',
        'total_tagihan_september',
        'oktober',
        'total_tagihan_oktober',
        'november',
        'total_tagihan_november',
        'desember',
        'total_tagihan_desember',
        'januari',
        'total_tagihan_januari',
        'februari',
        'total_tagihan_februari',
        'maret',
        'total_tagihan_maret',
        'april',
        'total_tagihan_april',
        'mei',
        'total_tagihan_mei',
        'juni',
        'total_tagihan_juni',
        'tahun_ajaran',
    ];
    public static function simpanTagihan($req)
    {
        $bulkInsertData = [];
        foreach ($req->rowsData as $row) {
            $bulkInsertData[] = [
                'nis' => $row['nis'],
                'juli' => $row['pembayaran']['Juli']['nominal'],
                'total_tagihan_juli' => $row['pembayaran']['Juli']['nominal'],
                'agustus' => $row['pembayaran']['Agustus']['nominal'],
                'total_tagihan_agustus' => $row['pembayaran']['Agustus']['nominal'],
                'september' => $row['pembayaran']['September']['nominal'],
                'total_tagihan_september' => $row['pembayaran']['September']['nominal'],
                'oktober' => $row['pembayaran']['Oktober']['nominal'],
                'total_tagihan_oktober' => $row['pembayaran']['Oktober']['nominal'],
                'november' => $row['pembayaran']['November']['nominal'],
                'total_tagihan_november' => $row['pembayaran']['November']['nominal'],
                'desember' => $row['pembayaran']['Desember']['nominal'],
                'total_tagihan_desember' => $row['pembayaran']['Desember']['nominal'],
                'januari' => $row['pembayaran']['Januari']['nominal'],
                'total_tagihan_januari' => $row['pembayaran']['Januari']['nominal'],
                'februari' => $row['pembayaran']['Februari']['nominal'],
                'total_tagihan_februari' => $row['pembayaran']['Februari']['nominal'],
                'maret' => $row['pembayaran']['Maret']['nominal'],
                'total_tagihan_maret' => $row['pembayaran']['Maret']['nominal'],
                'april' => $row['pembayaran']['April']['nominal'],
                'total_tagihan_april' => $row['pembayaran']['April']['nominal'],
                'mei' => $row['pembayaran']['Mei']['nominal'],
                'total_tagihan_mei' => $row['pembayaran']['Mei']['nominal'],
                'juni' => $row['pembayaran']['Juni']['nominal'],
                'total_tagihan_juni' => $row['pembayaran']['Juni']['nominal'],
                'tahun_ajaran' => $row['tahun_ajaran'],
            ];
        }
        $nisList = array_column($bulkInsertData, 'nis');
        $tahunAjaran = $bulkInsertData[0]['tahun_ajaran'];
        $existingData = Tagihan::whereIn('nis', $nisList)
            ->where('tahun_ajaran', $tahunAjaran)
            ->get()
            ->keyBy('nis');
        $newData = [];
        $updateData = [];
        foreach ($bulkInsertData as $data) {
            if (isset($existingData[$data['nis']])) {
                $updateData[] = [
                    'nis' => $data['nis'],
                    'tahun_ajaran' => $data['tahun_ajaran'],
                    'total_tagihan_juli' => $data['total_tagihan_juli'],
                    'total_tagihan_agustus' => $data['total_tagihan_agustus'],
                    'total_tagihan_september' => $data['total_tagihan_september'],
                    'total_tagihan_oktober' => $data['total_tagihan_oktober'],
                    'total_tagihan_november' => $data['total_tagihan_november'],
                    'total_tagihan_desember' => $data['total_tagihan_desember'],
                    'total_tagihan_januari' => $data['total_tagihan_januari'],
                    'total_tagihan_februari' => $data['total_tagihan_februari'],
                    'total_tagihan_maret' => $data['total_tagihan_maret'],
                    'total_tagihan_april' => $data['total_tagihan_april'],
                    'total_tagihan_mei' => $data['total_tagihan_mei'],
                    'total_tagihan_juni' => $data['total_tagihan_juni'],
                ];
            } else {
                $newData[] = $data;
            }
        }
        if (!empty($newData)) {
            Tagihan::insert($bulkInsertData);
        }
        if (!empty($updateData)) {
            $cases = [];
            $ids = [];
            $months = [
                'total_tagihan_juli', 'total_tagihan_agustus', 'total_tagihan_september', 'total_tagihan_oktober', 'total_tagihan_november', 'total_tagihan_desember',
                'total_tagihan_januari', 'total_tagihan_februari', 'total_tagihan_maret', 'total_tagihan_april', 'total_tagihan_mei', 'total_tagihan_juni'
            ];
            foreach ($months as $month) {
                $cases[$month] = "CASE";
            }
            foreach ($updateData as $update) {
                $nis = $update['nis'];
                $tahunAjaran = $update['tahun_ajaran'];
                foreach ($months as $month) {
                    $cases[$month] .= " WHEN nis = '{$nis}' AND tahun_ajaran = '{$tahunAjaran}' THEN '{$update[$month]}'";
                }
                $ids[] = "('{$nis}', '{$tahunAjaran}')";
            }
            foreach ($months as $month) {
                $cases[$month] .= " END";
            }
            $idsList = implode(", ", $ids);
            $query = "UPDATE eds_siswa_tagihan SET ";
            $setClauses = [];
            foreach ($months as $month) {
                $setClauses[] = "{$month} = {$cases[$month]}";
            }
            $query .= implode(", ", $setClauses);
            $query .= " WHERE (nis, tahun_ajaran) IN ({$idsList})";
            DB::statement($query);
        }        
    }
    public static function listTagihanTabel($req, $perHalaman, $offset)
    {
        $parameterpencarian = $req->parameter_pencarian;
        $kelas_terpilih = $req->kelas_terpilih;
        $tahun_ajaran_terpilih = $req->tahun_ajaran_terpilih;
        $query = DB::table((new self())->getTable())
        ->join('siswa_buku_induk', 'siswa_buku_induk.id', '=', 'siswa_tagihan.nis')
        ->join('atr_kelas', 'atr_kelas.id', '=', 'siswa_buku_induk.id_kelas')
        ->select('siswa_buku_induk.id as id_siswa', 'siswa_tagihan.*', 'siswa_buku_induk.nis', 'siswa_buku_induk.nama_siswa', 'atr_kelas.tingkat_kelas');
        if (!empty($kelas_terpilih)) {
            $query->where('atr_kelas.id', $kelas_terpilih);
        }else{
            $query->where(function($q) use ($parameterpencarian) {
                $q->where('siswa_buku_induk.nis', 'LIKE', '%' . $parameterpencarian . '%')
                  ->orWhere('siswa_buku_induk.nama_siswa', 'LIKE', '%' . $parameterpencarian . '%');
            })->where('siswa_tagihan.tahun_ajaran','LIKE','%' . $tahun_ajaran_terpilih. '%');
        }
        $jumlahdata = $query->count();
        $result = $query->take($perHalaman)
            ->skip($offset)
            ->orderBy('siswa_tagihan.nis', 'ASC')
            ->get();
        return [
            'data' => $result,
            'total' => $jumlahdata
        ];
    }
}
