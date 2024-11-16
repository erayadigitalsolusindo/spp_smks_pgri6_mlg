<?php

namespace App\Services;

use Illuminate\Support\Facades\{DB, Hash, Storage};
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\{Transaksi, Auth, Tagihan, TransaksiDetail};
use Spatie\Permission\Models\Role;

use Exception;

class TransaksiServices
{
    /**
     * Handle database transaction.
     *
     * @param array $data
     * @return mixed
     * @throws \Exception
     */
    public function handleTransactionTransaksiSiswa($request)
    {
        return DB::transaction(function () use ($request) {
            $bulkData = [];
            $ambil_id_transaksi = "";
            $tagihanset = Tagihan::where('nis', $request->id_siswa)->get();
            if (count($tagihanset) == 0) {
                throw new Exception("Data Tagihan Siswa tidak ditemukan. Silahkan tentukan tagihan pada master tagihan siswa");
            }
            $nomor_transaksi = 'TRX-SPP/'.$request->nis.'/'.$request->petugas_id.'/'. date('dmY') . '/' . date('His');
            $dataTransaksi = [
                'no_transaksi' => $nomor_transaksi,
                'nis' => $request->id_siswa,
                'tanggal' => Carbon::now()->format('Y-m-d')." ".Carbon::now()->format('H:i:s'),
                'petugas' => $request->petugas_id,
                'total_transaksi_bayar' => $request->totalbelanja,
                'tahun_ajaran' => $request->tahun_ajaran,
                'metode_pembayaran' => $request->metode_bayar,
                'nominal_bayar' => $request->nominal_bayar_konfirmasi,
                'no_transaksi_transfer' => $request->no_transaksi_transfer,

            ];
            if (filter_var($request->isedit, FILTER_VALIDATE_BOOLEAN)) {
                Transaksi::where('id', $request->id_transaksi_edit)->update($dataTransaksi);
                $ambil_id_transaksi = $request->id_transaksi_edit;
            }else{
                Transaksi::create($dataTransaksi);
                $ambil_id_transaksi = Transaksi::where('no_transaksi', $nomor_transaksi)->first();
                $ambil_id_transaksi = $ambil_id_transaksi->id;
            }
            for ($i = 0; $i < $request->totalbaris; $i++) {
                $bulkData[] = [
                    'id_transaksi' => $ambil_id_transaksi,
                    'nominal' => $request->nominal_bayar[$i],
                    'kode_bulan' => $request->kodebulan[$i],
                    'kode_jenis_transaksi' => $request->kode_jenis_transaksi[$i],
                    'keterangan' => $request->keterangan[$i] == "" ? "Tidak Ada Keterangan" : $request->keterangan[$i],
                    'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
                    'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
                ];
            }
            if (filter_var($request->isedit, FILTER_VALIDATE_BOOLEAN)) {
                TransaksiDetail::where('id_transaksi', $request->id_transaksi_edit)->delete();
            }
            TransaksiDetail::insert($bulkData);
        });
    }
    public function handleTransactionHapusTransaksi($data) {
        return DB::transaction(function () use ($data) {
            $transactions = DB::table('transaksi')
                ->join('transaksi_spp', 'transaksi.id', '=', 'transaksi_spp.id_transaksi')
                ->select('transaksi.tahun_ajaran', 'transaksi.nis', 'transaksi_spp.kode_bulan', 'transaksi_spp.nominal')
                ->where('transaksi.id', $data['id_transaksi'])
                ->get(); 

            $bulanMapping = [
                1 => 'januari',
                2 => 'februari',
                3 => 'maret',
                4 => 'april',
                5 => 'mei',
                6 => 'juni',
                7 => 'juli',
                8 => 'agustus',
                9 => 'september',
                10 => 'oktober',
                11 => 'november',
                12 => 'desember',
            ];

            foreach ($transactions as $item) {
                $tahunAjaranNew = $item->tahun_ajaran;
                $nisNew = $item->nis;
                $bulanTagihan = $item->kode_bulan;
                $nominalTransaksi = $item->nominal;
    
                // Update kolom bulan sesuai kode bulan
                DB::table('siswa_tagihan')
                    ->where('nis', $nisNew)
                    ->where('tahun_ajaran', $tahunAjaranNew)
                    ->update([
                        $bulanMapping[$bulanTagihan] => DB::raw("`$bulanMapping[$bulanTagihan]` + $nominalTransaksi")
                    ]);
            }
            DB::table('transaksi')->where('id', $data['id_transaksi'])->delete();
            DB::table('transaksi_spp')->where('id_transaksi', $data['id_transaksi'])->delete();
        });
    }
    
}
