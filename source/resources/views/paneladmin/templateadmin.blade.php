<!doctype html>
<html lang="en">
<head>
    @include('includes.assetsheader')
    @yield('css_load')
</head>
<body>
    <div class="loader-wrapper"> 
        <div class="loader loader-1">
            <div class="loader-outter"></div>
            <div class="loader-inner"></div>
            <div class="loader-inner-1"></div>
        </div>
    </div>
    <!-- loader ends-->
    <!-- tap on top starts-->
    <div class="tap-top"><i data-feather="chevrons-up"></i></div>
    <!-- tap on tap ends-->
    <!-- page-wrapper Start-->
    <div class="page-wrapper compact-wrapper" id="pageWrapper">
        <div class="page-header row">
            @include('includes.header')
        </div>
        <!-- Page Body Start-->
        <div class="page-body-wrapper">
          <!-- Page Sidebar Start-->
          @include('includes.sidebarmenu')
          <!-- Page Sidebar Ends-->
          <div class="page-body">
            <!-- Container-fluid starts-->
            <div class="container-fluid">
              @yield('konten_utama_admin')
            </div>
            <!-- Container-fluid Ends-->
          </div>
          <!-- footer start-->
          <footer class="footer">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-12 footer-copyright d-flex flex-wrap align-items-center justify-content-between">
                  <p class="mb-0 f-w-600">Copyright 2024 - <?=date('Y');?> © Artha Medical Clinic  </p>
                  <p class="mb-0 f-w-600">Hand crafted & made with <svg class="footer-icon">
                      <use href="{{ asset('mofi/assets/svg/icon-sprite.svg#footer-heart')}}"> </use>
                    </svg>
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    @include('includes.assetsfooter')
    @yield('js_load')
</body>
</html>