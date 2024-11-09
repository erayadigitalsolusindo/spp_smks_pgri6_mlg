(function ($) {
  "use strict";

  // Toggle sidebar
  $(".toggle-nav").click(function () {
    $("#sidebar-links .nav-menu").css("left", "0px");
    $(".page-wrapper").toggleClass("sidebar-close");
  });

  $(".mobile-back").click(function () {
    $("#sidebar-links .nav-menu").css("left", "-410px");
  });

  // Set page wrapper class from localStorage
  $(".page-wrapper").attr(
    "class",
    "page-wrapper " + localStorage.getItem("page-wrapper")
  );
  if (localStorage.getItem("page-wrapper") === null) {
    $(".page-wrapper").addClass("compact-wrapper");
  }

  // Sidebar menu functionality
  if ($("#pageWrapper").hasClass("compact-wrapper")) {

    // Add arrow icon only if there is a submenu
    $(".sidebar-list").each(function () {
      if ($(this).find(".sidebar-submenu").length > 0) {
        $(this).find(".sidebar-title").append(
          '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
        );
      }
    });

    $(".sidebar-title").click(function () {
      $(".sidebar-title").removeClass("active");
      $(".sidebar-submenu, .menu-content").slideUp("normal");

      if ($(this).next().is(":hidden")) {
        $(this).addClass("active");
        $(this).find(".according-menu i").removeClass("fa-angle-right").addClass("fa-angle-down");
        $(this).next().slideDown("normal");
      } else {
        $(this).find(".according-menu i").removeClass("fa-angle-down").addClass("fa-angle-right");
      }
    });

    $(".sidebar-submenu, .menu-content").hide();

    $(".submenu-title").click(function () {
      $(".submenu-title").removeClass("active");
      $(".submenu-content").slideUp("normal");

      if ($(this).next().is(":hidden")) {
        $(this).addClass("active");
        $(this).find(".according-menu i").removeClass("fa-angle-right").addClass("fa-angle-down");
        $(this).next().slideDown("normal");
      } else {
        $(this).find(".according-menu i").removeClass("fa-angle-down").addClass("fa-angle-right");
      }
    });

    $(".submenu-content").hide();
  }

  // Toggle sidebar
  $(".toggle-sidebar").click(function () {
    $(".sidebar-wrapper").toggleClass("close_icon");
    $(".page-header").toggleClass("close_icon");
    $(window).trigger("overlay");
  });

  // Overlay functionality
  $(window).on("overlay", function () {
    let $bgOverlay = $(".bg-overlay");
    let $nav = $(".sidebar-wrapper");
    let isHidden = $nav.hasClass("close_icon");

    if ($(window).width() <= 1184 && !isHidden && $bgOverlay.length === 0) {
      $('<div class="bg-overlay active"></div>').appendTo($("body"));
    }

    if (isHidden && $bgOverlay.length > 0) {
      $bgOverlay.remove();
    }
  });

  // Responsive sidebar
  function responsiveSidebar() {
    if ($(window).width() <= 1184) {
      $(".sidebar-wrapper").addClass("close_icon");
      $(".page-header").addClass("close_icon");
    } else {
      $(".sidebar-wrapper").removeClass("close_icon");
      $(".page-header").removeClass("close_icon");
    }
  }

  $(window).resize(responsiveSidebar);
  responsiveSidebar();

  // Active link highlighting
  let current = window.location.pathname;
  $(".sidebar-wrapper nav ul li a").each(function () {
    let $this = $(this);
    if ($this.hasClass('active') || $this.attr("href").indexOf(current) !== -1) {
      $this.addClass("active");
      $this.parents("li").addClass("active");
      $this.parents(".sidebar-submenu").prev().addClass("active").children(".according-menu").find("i").removeClass("fa-angle-right").addClass("fa-angle-down");
      $this.parents(".sidebar-submenu").slideDown();
    }
  });

})(jQuery);
