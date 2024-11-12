<div class="header-logo-wrapper col-auto">
    <div class="logo-wrapper"><a href="index.html"><img class="img-fluid" src="{{asset('mofi/assets/images/logo/logo_pgri.png')}}" alt=""/></a></div>
  </div>
  <div class="col-4 col-xl-4 page-title">
    <h4 class="f-w-700">{{ $data['title'] }}</h4>
    <nav>
      <ol class="breadcrumb justify-content-sm-start align-items-center mb-0">
        <li class="breadcrumb-item"><a href="{{ url('admin/beranda') }}"> <i data-feather="home"> </i></a></li>
        @foreach ($data['breadcrumb'] as $key => $value)
          <li class="breadcrumb-item f-w-400"><a href="{{ $value }}">{{ $key }}</a></li>
        @endforeach
      </ol>
    </nav>
  </div>
  <!-- Page Header Start-->
  <div class="header-wrapper col m-0">
    <div class="row">
      <form class="form-inline search-full col" action="#" method="get">
        <div class="form-group w-100">
          <div class="Typeahead Typeahead--twitterUsers">
            <div class="u-posRelative">
              <input class="demo-input Typeahead-input form-control-plaintext w-100" type="text" placeholder="Search Mofi .." name="q" title="" autofocus>
              <div class="spinner-border Typeahead-spinner" role="status"><span class="sr-only">Loading...</span></div><i class="close-search" data-feather="x"></i>
            </div>
            <div class="Typeahead-menu"></div>
          </div>
        </div>
      </form>
      <div class="header-logo-wrapper col-auto p-0">
        <div class="logo-wrapper"><a href="index.html"><img class="img-fluid" src="{{ asset('mofi/assets/images/logo/logo_pgri.png')}}" alt=""></a></div>
        <div class="toggle-sidebar">
          <svg class="stroke-icon sidebar-toggle status_toggle middle">
            <use href="{{ asset('mofi/assets/svg/icon-sprite.svg#toggle-icon')}}"></use>
          </svg>
        </div>
      </div>
      <div class="nav-right col-xxl-8 col-xl-6 col-md-7 col-8 pull-right right-header p-0 ms-auto">
        <ul class="nav-menus">
          <li class="onhover-dropdown">
            <svg>
              <use href="{{ asset('mofi/assets/svg/icon-sprite.svg#header-bookmark')}}"></use>
            </svg>
            <div class="onhover-show-div bookmark-flip">
              <div class="flip-card">
                <div class="flip-card-inner">
                  <div class="front">
                    <h5 class="f-18 f-w-600 mb-0 dropdown-title">Bookmark</h5>
                    <ul class="bookmark-dropdown">
                      <li>
                        <div class="row">
                          <div class="col-4 text-center">
                            <div class="bookmark-content">
                              <div class="bookmark-icon bg-light-primary"><i class="stroke-primary" data-feather="file-text"></i></div><span class="font-primary">Forms</span>
                            </div>
                          </div>
                          <div class="col-4 text-center">
                            <div class="bookmark-content">
                              <div class="bookmark-icon bg-light-secondary"><i class="stroke-secondary" data-feather="user"></i></div><span class="font-secondary">Profile</span>
                            </div>
                          </div>
                          <div class="col-4 text-center">
                            <div class="bookmark-content">
                              <div class="bookmark-icon bg-light-warning"><i class="stroke-warning" data-feather="server"></i></div><span class="font-warning">Tables</span>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li class="text-center"><a class="flip-btn f-w-700" id="flip-btn" href="javascript:void(0)">Add New Bookmark</a></li>
                    </ul>
                  </div>
                  <div class="back">
                    <ul>
                      <li>
                        <div class="bookmark-dropdown flip-back-content">
                          <input type="text" placeholder="search...">
                        </div>
                      </li>
                      <li><a class="f-w-700 d-block flip-back" id="flip-back" href="javascript:void(0)">Back</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="mode">
              <svg>
                <use href="{{ asset('mofi/assets/svg/icon-sprite.svg#moon')}}"></use>
              </svg>
            </div>
          </li>
          <li class="profile-nav onhover-dropdown px-0 py-0">
            <div class="d-flex profile-media align-items-center"><img class="img-30" src="{{ asset('mofi/assets/images/dashboard/profile.png')}}" alt="">
              <div class="flex-grow-1"><span>{{ $data['user_details']->nama_pegawai }}</span>
                <p class="mb-0 font-outfit">{{ $data['user_details']->jabatan }} <i class="fa fa-angle-down"></i></p>
              </div>
            </div>
            <ul class="profile-dropdown onhover-show-div">
              <li><a href="javascript:void(0)"><i data-feather="user"></i><span>Profile</span></a></li>
              <li><a href="javascript:void(0)"><i data-feather="mail"></i><span>Inbox</span></a></li>
              <li><a href="javascript:void(0)"><i data-feather="file-text"></i><span>Taskboard</span></a></li>
              <li><a href="javascript:void(0)"><i data-feather="settings"></i><span>Settings</span></a></li>
              <li><a href="{{ url('pintukeluar') }}"><i data-feather="log-out"> </i><span>Keluar</span></a></li>
            </ul>
          </li>
        </ul>
      </div>
      <script class="result-template" type="text/x-handlebars-template">
        <div class="ProfileCard u-cf">                        
        <div class="ProfileCard-avatar"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-airplay m-0"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon></svg></div>
        <div class="ProfileCard-details">
        <div class="ProfileCard-realName">Administrator</div>
        </div>
        </div>
      </script>
      <script class="empty-template" type="text/x-handlebars-template"><div class="EmptyMessage">Your search turned up 0 results. This most likely means the backend is down, yikes!</div></script>
    </div>
</div>
  <!-- Page Header Ends -->