<!DOCTYPE html>
<html>
<head>
    <title>{{$data['title']}}</title>
    <style>
        @page { 
            margin-top: 5px;
            margin-bottom: 20px;
            margin-left: 20px;
            margin-right: 20px;
        }
        body { 
            margin-top: 5px;
            margin-bottom: 20px;
            margin-left: 20px;
            margin-right: 20px;
        }
        #table_laporan_pembayaran, #table_laporan_pembayaran td {
            border: 1px solid black;
            border-collapse: collapse;
            padding: 5px;
        }
    </style>
</head>
<body >
    <div class="header">
        <table style="width: 100%;">
            <tr>
                <td style="width:20%;">
                    <img src="{{ asset('mofi/assets/images/logo/logo_yplp.png') }}" alt="Logo SMK PGRI 6 Malang" style="width: 100%;">
                </td>
                <td style="width:80%; text-align: center;">
                    <p style="margin-bottom: -25px;font-size:12px">PERWAKILAN YAYASAN PEMBINA LEMBAGA PENDIDIKAN PGRI KOTA MALANG-JAWA TIMUR</p>
                    <h1>SMKS PGRI 6 MALANG</h1>
                    <p style="margin-top: -25px; margin-bottom: 0;">
                        Terakreditasi A<br>
                        Alamat : Jl. Janti Selatan No. 100 Kelurahan Bandungrejosari, Kecamatan Sukun <br>KOTA MALANG<br>
                        Telp : (0341) 800428 - Email : halo@smkspgri6mlg.sch.id
                    </p>
                </td>
            </tr>
        </table>
        @php
            $total_bayar = 0;
            @endphp
        @foreach ($data['informasi_transaksi'] as $informasi)
        @php
            $total_bayar += $informasi->sum_nominal;
        @endphp
        @endforeach
        <div style="font-size: 20px; font-weight: bold;">Total Data : {{$data['total_data']}} Data</div>
        <div style="font-size: 20px; font-weight: bold;">Total Pendapatan : {{ number_format($total_bayar, 0, ',', '.') }}</div>
        <div style="text-align: center;">Laporan Pembayaran Periode {{$data['tanggal_awal']}} s/d {{$data['tanggal_akhir']}}</div>
        <table id="table_laporan_pembayaran" style="width: 100%;">
            @php
            $nomor = 1;
            @endphp
            <tr style="text-align: center;">
               <td>No</td>
               <td>Informasi Siswa</td>
               <td>Waktu</td>
               <td>Nominal</td>
            </tr>
            @foreach ($data['informasi_transaksi'] as $informasi)
            <tr>
                <td style="text-align: center;">{{$nomor++}}</td>
                <td>NIS: {{$informasi->nis_siswa}}<br>Nama: {{$informasi->nama_siswa}}</td>
                <td>{{$informasi->tanggal_transaksi}}</td>
                <td style="text-align: right;">{{ number_format($informasi->sum_nominal, 0, ',', '.') }}</td>
            </tr>
            @endforeach
            <tr>
                <td colspan="3" style="text-align: right;">Total Pendapatan</td>
                <td style="text-align: right;">{{ number_format($total_bayar, 0, ',', '.') }}</td>
            </tr>
        </table>
    </div>   
</body>
</html>
