<!doctype html>
<html lang="en">
<head>
    @include('includes.assetsheader')
    @yield('css_load')
</head>
<body>
    @yield('konten_utama')
    @include('includes.assetsfooter', ['tipe_halaman' => $data['tipe_halaman']])
    @yield('js_load')
</body>
</html>