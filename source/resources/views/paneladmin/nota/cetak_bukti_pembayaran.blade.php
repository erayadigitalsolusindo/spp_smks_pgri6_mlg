<!DOCTYPE html>
<html>
<head>
    <title>Nota Pembayaran - {{ $data['title'] }}</title>
    <style>
        .marginnya {
            margin-top: -50px;
        }
        .left {
            float: left;
            width: 49%;
        }
        .right {
            float: right;
            width: 49%;
        }
    </style>
</head>
<body>
    <div class="left marginnya">
        <div class="header">
            <table style="width: 100%;">
                <tr>
                    <td style="width:20%;">
                        <img src="{{ asset('mofi/assets/images/logo/Logo_saja.png') }}" alt="Logo SMK PGRI 6 Malang" style="width: 100%;padding-top: 15px;">
                    </td>
                    <td style="width:70%; text-align: center;">
                        <h3>SMKS PGRI 6 MALANG</h3>
                        <p style="margin-top: -15px; margin-bottom: 0;">
                            Jl. Janti Selatan No 100 Malang<br>
                            Telp : (0341) 800428
                        </p>
                    </td>
                </tr>
            </table>
            <div style="text-align: right; margin-bottom: 0;">
                Petugas : {{ $data['informasi_transaksi'][0]->nama_pegawai }}<br>
                Metode : {{ $data['informasi_transaksi'][0]->metode_pembayaran }}<br>
                Tanggal Trx : {{ date('d-m-Y H:i:s', strtotime($data['informasi_transaksi'][0]->tanggal)) }}<br>
                ID: {{ $data['informasi_transaksi'][0]->no_transaksi }}
            </div>
        </div>
        <hr>
        <strong>NIS Siswa:</strong> {{ $data['informasi_transaksi'][0]->nis }} ({{ $data['informasi_transaksi'][0]->tingkat_kelas }})<br>
        <strong>Nama Siswa:</strong> {{ $data['informasi_transaksi'][0]->nama_siswa }}<br>
        <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: blue; color: white;">
                <td colspan="2">Informasi Pembayaran</td>
            </tr>
            @php $totalNominal = 0; $pembayaran = 0; $kembalian = 0; @endphp
            @foreach ($data['informasi_transaksi'] as $key => $value)
            @php
                $bulanArray = [
                    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                ];
                $namaBulan = $bulanArray[$value->kode_bulan - 1] ?? "Bulan tidak valid";
            @endphp
            <tr>
                <td colspan="2">{{ $loop->iteration }}. [{{ $namaBulan }}] {{ $value->jenis_transaksi }}</td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: right;">Rp. {{ number_format($value->nominal, 0, ',', '.') }}</td>
            </tr>
            @if ($data['informasi_transaksi'][0]->keterangan !== "Tidak Ada Keterangan")
            <tr>
                <td style="text-align: right; font-weight: bold;">Keterangan</td>
                <td style="text-align: right; font-weight: bold;">{{ $data['informasi_transaksi'][0]->keterangan }}</td>
            </tr>
            @endif
            @php 
                $totalNominal += $value->nominal; 
                $pembayaran = $data['informasi_transaksi'][0]->nominal_bayar; 
                $kembalian = $pembayaran - $totalNominal;
            @endphp
            @endforeach
            <tr style="background-color: blue; color: white;">
                <td style="text-align: right; font-weight: bold;">Total</td>
                <td style="text-align: right; font-weight: bold;">Rp. {{ number_format($totalNominal, 0, ',', '.') }}</td>
            </tr>
            <tr style="background-color: blue; color: white;">
                <td style="text-align: right; font-weight: bold;">Bayar</td>
                <td style="text-align: right; font-weight: bold;">Rp. {{ number_format($pembayaran, 0, ',', '.') }}</td>
            </tr>
            <tr style="background-color: blue; color: white;">
                <td style="text-align: right; font-weight: bold;">Kembalian</td>
                <td style="text-align: right; font-weight: bold;">Rp. {{ number_format($kembalian, 0, ',', '.') }}</td>
            </tr>
        </table> 
    </div>
    <div class="right marginnya">
        <div class="header">
            <table style="width: 100%;">
                <tr>
                    <td style="width:20%;">
                        <img src="{{ asset('mofi/assets/images/logo/Logo_saja.png') }}" alt="Logo SMK PGRI 6 Malang" style="width: 100%;padding-top: 15px;">
                    </td>
                    <td style="width:70%; text-align: center;">
                        <h3>SMKS PGRI 6 MALANG</h3>
                        <p style="margin-top: -15px; margin-bottom: 0;">
                            Jl. Janti Selatan No 100 Malang<br>
                            Telp : (0341) 800428
                        </p>
                    </td>
                </tr>
            </table>
            <div style="text-align: right; margin-bottom: 0;">
                Petugas : {{ $data['informasi_transaksi'][0]->nama_pegawai }}<br>
                Metode : {{ $data['informasi_transaksi'][0]->metode_pembayaran }}<br>
                Tanggal Trx : {{ date('d-m-Y H:i:s', strtotime($data['informasi_transaksi'][0]->tanggal)) }}<br>
                ID: {{ $data['informasi_transaksi'][0]->no_transaksi }}
            </div>
        </div>
        <hr>
        <strong>NIS Siswa:</strong> {{ $data['informasi_transaksi'][0]->nis }} ({{ $data['informasi_transaksi'][0]->tingkat_kelas }})<br>
        <strong>Nama Siswa:</strong> {{ $data['informasi_transaksi'][0]->nama_siswa }}<br>
        <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: blue; color: white;">
                <td colspan="2">Informasi Pembayaran</td>
            </tr>
            @php $totalNominal = 0; $pembayaran = 0; $kembalian = 0; @endphp
            @foreach ($data['informasi_transaksi'] as $key => $value)
            @php
                $bulanArray = [
                    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                ];
                $namaBulan = $bulanArray[$value->kode_bulan - 1] ?? "Bulan tidak valid";
            @endphp
            <tr>
                <td colspan="2">{{ $loop->iteration }}. [{{ $namaBulan }}] {{ $value->jenis_transaksi }}</td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: right;">Rp. {{ number_format($value->nominal, 0, ',', '.') }}</td>
            </tr>
            @if ($data['informasi_transaksi'][0]->keterangan !== "Tidak Ada Keterangan")
            <tr>
                <td style="text-align: right; font-weight: bold;">Keterangan</td>
                <td style="text-align: right; font-weight: bold;">{{ $data['informasi_transaksi'][0]->keterangan }}</td>
            </tr>
            @endif
            @php 
                $totalNominal += $value->nominal; 
                $pembayaran = $data['informasi_transaksi'][0]->nominal_bayar; 
                $kembalian = $pembayaran - $totalNominal;
            @endphp
            @endforeach
            <tr style="background-color: blue; color: white;">
                <td style="text-align: right; font-weight: bold;">Total</td>
                <td style="text-align: right; font-weight: bold;">Rp. {{ number_format($totalNominal, 0, ',', '.') }}</td>
            </tr>
            <tr style="background-color: blue; color: white;">
                <td style="text-align: right; font-weight: bold;">Bayar</td>
                <td style="text-align: right; font-weight: bold;">Rp. {{ number_format($pembayaran, 0, ',', '.') }}</td>
            </tr>
            <tr style="background-color: blue; color: white;">
                <td style="text-align: right; font-weight: bold;">Kembalian</td>
                <td style="text-align: right; font-weight: bold;">Rp. {{ number_format($kembalian, 0, ',', '.') }}</td>
            </tr>
        </table>
    </div>
</body>
</html>
