<div class="sidebar-wrapper" id="sidebar-wrapper" data-layout="stroke-svg">
    <div>
      <div class="logo-wrapper">
        <a href="{{ url('/admin/beranda') }}">
          <img class="img-fluid" src="{{asset('mofi/assets/images/logo/Logo_AMC_Full_WH.png')}}" alt="Logo MCU Artha Medical Center" style="height: 100%;width: 75%;">
        </a>
        <div class="back-btn"><i class="fa fa-angle-left"></i></div>
        <div class="toggle-sidebar">
          <svg class="stroke-icon sidebar-toggle status_toggle middle">
            <use href="{{ asset('mofi/assets/svg/icon-sprite.svg#toggle-icon')}}"></use>
          </svg>
          <svg class="fill-icon sidebar-toggle status_toggle middle">
            <use href="{{ asset('mofi/assets/svg/icon-sprite.svg#fill-toggle-icon')}}"></use>
          </svg>
        </div>
      </div>
      <div class="logo-icon-wrapper"><a href="index.html"><img class="img-fluid" src="{{ asset('mofi/assets/images/logo/logo-icon.png')}}" alt=""></a></div>
      <nav class="sidebar-main">
        <div class="left-arrow" id="left-arrow"><i data-feather="arrow-left"></i></div>
        <div id="sidebar-menu">
          <ul class="sidebar-links" id="simple-bar">
            <li class="back-btn"><a href="index.html"><img class="img-fluid" src="{{ asset('mofi/assets/images/logo/logo-icon.png')}}" alt=""></a>
              <div class="mobile-back text-end"><span>Back</span><i class="fa fa-angle-right ps-2" aria-hidden="true"></i></div>
            </li>
            <li class="pin-title sidebar-main-title">
              <div> 
                <h6>Pinned</h6>
              </div>
            </li>
            <li class="sidebar-main-title">
              <div>
                <h6>NAVIGASI</h6>
              </div>
            </li>
            <li class="sidebar-list"><i class="fa fa-thumb-tack"></i><a class="sidebar-link sidebar-title" href="javascript:void(0)">
                <svg class="stroke-icon">
                  <use href="{{ asset('mofi/assets/svg/icon-sprite.svg#stroke-home')}}"></use>
                </svg>
                <svg class="fill-icon">
                  <use href="{{ asset('mofi/assets/svg/icon-sprite.svg#fill-home')}}"></use>
                </svg><span>Beranda</span></a>
            </li>
            <li class="sidebar-list"><i class="fa fa-thumb-tack"></i><a class="sidebar-link sidebar-title" href="javascript:void(0)">
                <svg class="stroke-icon">
                  <use href="{{ asset('mofi/assets/svg/icon-sprite.svg#stroke-widget')}}"></use>
                </svg>
                <svg class="fill-icon">
                  <use href="{{ asset('mofi/assets/svg/icon-sprite.svg#fill-widget')}}"></use>
                </svg><span>Pembayaran</span></a>
              <ul class="sidebar-submenu">
                <li><a href="{{url('spp/daftar_pembayaran')}}">Transaksi Pembayaran</a></li>
                <li><a href="{{url('spp/daftar_tagihan')}}">Daftar Tagihan</a></li>
              </ul>
            </li>
            <li class="sidebar-main-title">
              <div>
                <h6>PENGATURAN</h6>
              </div>
            </li>
            <li class="sidebar-list"><i class="fa fa-thumb-tack"></i><a class="sidebar-link sidebar-title" href="javascript:void(0)">
                <svg class="stroke-icon">
                  <use href="{{ asset('mofi/assets/svg/icon-sprite.svg#stroke-widget')}}"></use>
                </svg>
                <svg class="fill-icon">
                  <use href="{{ asset('mofi/assets/svg/icon-sprite.svg#fill-widget')}}"></use>
                </svg><span>Master Data</span></a>
              <ul class="sidebar-submenu">
                <li><a href="{{url('masterdata/daftar_perusahaan')}}">Perusahaan</a></li>
                <li><a class="submenu-title" href="javascript:void(0)">Atribut siswa<div class="according-menu"><i class="fa fa-angle-right"></i></div></a>
                  <ul class="nav-sub-childmenu submenu-content">
                    <li><a href="{{url('masterdata/daftar_jurusan_siswa')}}">Jurusan Siswa</a></li>
                    <li><a href="{{url('masterdata/daftar_kelas_siswa')}}">Kelas Siswa</a></li>
                    <li><a href="{{url('masterdata/daftar_jenis_pembayaran')}}">Jenis Pembayaran</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li class="sidebar-list"><i class="fa fa-thumb-tack"></i><a class="sidebar-link sidebar-title" href="javascript:void(0)">
                <svg class="stroke-icon">
                  <use href="{{asset('mofi/assets/svg/icon-sprite.svg#stroke-editors')}}"></use>
                </svg>
                <svg class="fill-icon">
                  <use href="{{ asset('mofi/assets/svg/icon-sprite.svg#fill-editors')}}"></use>
                </svg><span>Petugas</span></a>
              <ul class="sidebar-submenu">
                <li><a href="{{url('/admin/pengguna_aplikasi')}}">Pengguna Aplikasi </a></li>
                <li><a href="{{url('/admin/role')}}">Hak Akses</a></li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="right-arrow" id="right-arrow"><i data-feather="arrow-right"></i></div>
      </nav>
    </div>
</div>