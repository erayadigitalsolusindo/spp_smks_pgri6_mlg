<!DOCTYPE html>
<html>
<head>
    <title>Nota Pembayaran - {{ $data['title'] }}</title>
</head>
<body>
    <div class="header">
        <table style="width: 100%;">
            <tr>
                <td style="width: 30%; vertical-align: top;">
                    <img src="{{ asset('mofi/assets/images/logo/Logo_AMC_Full.png') }}" alt="Logo SMK PGRI 6 MALANG" style="width: 100%;">
                </td>
                <td style="width: 70%; vertical-align: top; text-align: center;">
                    <h1 style="margin: 0;">SMK PGRI 6 MALANG</h1>
                    <p style="margin: 5px 0;">Jl. Janti Selatan, Gadang, Kec. Sukun, Kota Malang, Jawa Timur 65148</p>
                    <p style="margin: 5px 0;">Telp: (0341) 800428 - Email: info@smkpgri6malang.sch.id</p>
                </td>
            </tr>
        </table>
    </div>
    <hr>
    <strong>NIS Siswa:</strong> {{ $data['informasi_transaksi'][0]->nis }}<br>
    <strong>Nama Siswa:</strong> {{ $data['informasi_transaksi'][0]->nama_siswa }}<br>
    <strong>Kelas:</strong> {{ $data['informasi_transaksi'][0]->tingkat_kelas }}<br>
    <strong>Tanggal Bayar:</strong> {{ date('d-m-Y H:i:s', strtotime($data['informasi_transaksi'][0]->tanggal)) }}
    <hr>
    <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: blue; color: white;">
            <td style="text-align: center;">No</td>
            <td>Jenis Pembayaran</td>
            <td>Nominal</td>
            <td>Keterangan</td>
        </tr>
        @php $totalNominal = 0; @endphp
        @foreach ($data['informasi_transaksi'] as $key => $value)
        @php
            $bulanArray = [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                "Juli", "Agustus", "September", "Oktober", "November", "Desember"
            ];
            $namaBulan = $bulanArray[$value->kode_bulan - 1] ?? "Bulan tidak valid";
        @endphp
        <tr>
            <td style="text-align: center;">{{ $loop->iteration }}</td>
            <td>[{{ $value->kode_jenis_transaksi }}] {{ $value->jenis_transaksi }} (Bulan : {{ $namaBulan }})</td>
            <td style="text-align: right;">Rp. {{ number_format($value->nominal, 0, ',', '.') }}</td>
            <td>{{ $value->keterangan }}</td>
        </tr>
        @php $totalNominal += $value->nominal; @endphp
        @endforeach
        <tr style="background-color: blue; color: white;">
            <td colspan="2" style="text-align: right; font-weight: bold;">Sub Total</td>
            <td style="text-align: right; font-weight: bold;">Rp. {{ number_format($totalNominal, 0, ',', '.') }}</td>
            <td></td>
        </tr>
    </table>
</body>
</html>
