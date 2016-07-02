(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MOBILE_BREAK_POINT, fontSizeDetector, mobileDetector;

MOBILE_BREAK_POINT = 768;

fontSizeDetector = function() {
  var clientWidth, docEl;
  docEl = document.documentElement;
  clientWidth = docEl.clientWidth;
  if (!clientWidth) {
    return;
  }
  return docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
};

mobileDetector = function() {
  if ($(window).width() < MOBILE_BREAK_POINT) {
    $('body').addClass('mobile-view');
    return fontSizeDetector();
  } else {
    $('body').removeClass('mobile-view');
    return document.documentElement.style.fontSize = 20 + 'px';
  }
};

$(window).on('resize orientationchange', mobileDetector);

mobileDetector();
},{}],2:[function(require,module,exports){
$(function() {
	var w = $(window).width();

	var videos = {
		v1 : "../video/test.mp4",
		v2 : "../video/test.mp4"
	}

	$("#banner .slide").slick({
		slidesToShow: 1,
  		slidesToScroll: 1,
  		adaptiveHeight: true,
  		lazyLoad: 'ondemand',
  		prevArrow : "<div class='slick-prev-arrow slick-arrow'><img src='../img/arrow-l.png'></div>",
        nextArrow : "<div class='slick-next-arrow slick-arrow'><img src='../img/arrow-r.png'></div>"
	})

	$("#banner .bottom-block li").click(function(){
		var sid = $(this).attr('sid');
		$("#banner .slide").slick('slickGoTo', sid);
		$("#banner .bottom-block li.active").removeClass('active');
		$(this).addClass('active');
	})

	$("#banner .slide").on('afterChange', function(param){
		var sid = $("#banner .slide .slick-active").attr('data-slick-index');
		$("#banner .bottom-block li.active").removeClass('active');
		$("#banner .bottom-block li[sid=" + sid + "]").addClass('active');
	})

	var sn = w > 1600 ? 4 : 3;

	$(".video-slide").slick({
		slidesToShow: sn,
  		slidesToScroll: 1,
  		arrows: false
	});

	if(w > 1600){
		$("#video-container").addClass('wide-mode');
	}

	$("#video-container .slick-prev-arrow").click(function(){
		$(".video-slide").slick('slickPrev');
	})

	$("#video-container .slick-next-arrow").click(function(){
		$(".video-slide").slick('slickNext');
	})

	$("#video-container .video").click(function(){
		var src = $(this).attr('vid');
		popup(src);
	})

	var idx = $("body").attr("idx");

	$("#main-navbar li a[idx='" + idx + "']").addClass('active');

	var h = parseInt($(window).height() - 250);
	$(".site-content").css('min-height', h);
	$("footer").show();

	$(".page-events .other-events p").click(function() {
		var idx = $(this).attr('index');
		$(".page-events .main-event").html($(".page-events .details .item[index=" + idx + "]").html());
	})

	function popup(src) {
		var v = "<video width='540' height='340' src='" + videos[src] + "'></video>";

		var vc = $(".video-modal .video-c").html(v);
		// $("#v1").appendTo(vc);
		window.player = new MediaElementPlayer('.video-modal video');
		$(".video-modal").modal();
		window.player.play();

		$(".video-modal").click(function(){
			window.player.pause();
			$(".video-modal .video-c").empty();
		})
	}
})
},{}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29mZmVlLmpzIiwic3JjL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIE1PQklMRV9CUkVBS19QT0lOVCwgZm9udFNpemVEZXRlY3RvciwgbW9iaWxlRGV0ZWN0b3I7XG5cbk1PQklMRV9CUkVBS19QT0lOVCA9IDc2ODtcblxuZm9udFNpemVEZXRlY3RvciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY2xpZW50V2lkdGgsIGRvY0VsO1xuICBkb2NFbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgY2xpZW50V2lkdGggPSBkb2NFbC5jbGllbnRXaWR0aDtcbiAgaWYgKCFjbGllbnRXaWR0aCkge1xuICAgIHJldHVybjtcbiAgfVxuICByZXR1cm4gZG9jRWwuc3R5bGUuZm9udFNpemUgPSAyMCAqIChjbGllbnRXaWR0aCAvIDMyMCkgKyAncHgnO1xufTtcblxubW9iaWxlRGV0ZWN0b3IgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgTU9CSUxFX0JSRUFLX1BPSU5UKSB7XG4gICAgJCgnYm9keScpLmFkZENsYXNzKCdtb2JpbGUtdmlldycpO1xuICAgIHJldHVybiBmb250U2l6ZURldGVjdG9yKCk7XG4gIH0gZWxzZSB7XG4gICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdtb2JpbGUtdmlldycpO1xuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSAyMCArICdweCc7XG4gIH1cbn07XG5cbiQod2luZG93KS5vbigncmVzaXplIG9yaWVudGF0aW9uY2hhbmdlJywgbW9iaWxlRGV0ZWN0b3IpO1xuXG5tb2JpbGVEZXRlY3RvcigpOyIsIiQoZnVuY3Rpb24oKSB7XG5cdHZhciB3ID0gJCh3aW5kb3cpLndpZHRoKCk7XG5cblx0dmFyIHZpZGVvcyA9IHtcblx0XHR2MSA6IFwiLi4vdmlkZW8vdGVzdC5tcDRcIixcblx0XHR2MiA6IFwiLi4vdmlkZW8vdGVzdC5tcDRcIlxuXHR9XG5cblx0JChcIiNiYW5uZXIgLnNsaWRlXCIpLnNsaWNrKHtcblx0XHRzbGlkZXNUb1Nob3c6IDEsXG4gIFx0XHRzbGlkZXNUb1Njcm9sbDogMSxcbiAgXHRcdGFkYXB0aXZlSGVpZ2h0OiB0cnVlLFxuICBcdFx0bGF6eUxvYWQ6ICdvbmRlbWFuZCcsXG4gIFx0XHRwcmV2QXJyb3cgOiBcIjxkaXYgY2xhc3M9J3NsaWNrLXByZXYtYXJyb3cgc2xpY2stYXJyb3cnPjxpbWcgc3JjPScuLi9pbWcvYXJyb3ctbC5wbmcnPjwvZGl2PlwiLFxuICAgICAgICBuZXh0QXJyb3cgOiBcIjxkaXYgY2xhc3M9J3NsaWNrLW5leHQtYXJyb3cgc2xpY2stYXJyb3cnPjxpbWcgc3JjPScuLi9pbWcvYXJyb3ctci5wbmcnPjwvZGl2PlwiXG5cdH0pXG5cblx0JChcIiNiYW5uZXIgLmJvdHRvbS1ibG9jayBsaVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdHZhciBzaWQgPSAkKHRoaXMpLmF0dHIoJ3NpZCcpO1xuXHRcdCQoXCIjYmFubmVyIC5zbGlkZVwiKS5zbGljaygnc2xpY2tHb1RvJywgc2lkKTtcblx0XHQkKFwiI2Jhbm5lciAuYm90dG9tLWJsb2NrIGxpLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0JCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdH0pXG5cblx0JChcIiNiYW5uZXIgLnNsaWRlXCIpLm9uKCdhZnRlckNoYW5nZScsIGZ1bmN0aW9uKHBhcmFtKXtcblx0XHR2YXIgc2lkID0gJChcIiNiYW5uZXIgLnNsaWRlIC5zbGljay1hY3RpdmVcIikuYXR0cignZGF0YS1zbGljay1pbmRleCcpO1xuXHRcdCQoXCIjYmFubmVyIC5ib3R0b20tYmxvY2sgbGkuYWN0aXZlXCIpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHQkKFwiI2Jhbm5lciAuYm90dG9tLWJsb2NrIGxpW3NpZD1cIiArIHNpZCArIFwiXVwiKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdH0pXG5cblx0dmFyIHNuID0gdyA+IDE2MDAgPyA0IDogMztcblxuXHQkKFwiLnZpZGVvLXNsaWRlXCIpLnNsaWNrKHtcblx0XHRzbGlkZXNUb1Nob3c6IHNuLFxuICBcdFx0c2xpZGVzVG9TY3JvbGw6IDEsXG4gIFx0XHRhcnJvd3M6IGZhbHNlXG5cdH0pO1xuXG5cdGlmKHcgPiAxNjAwKXtcblx0XHQkKFwiI3ZpZGVvLWNvbnRhaW5lclwiKS5hZGRDbGFzcygnd2lkZS1tb2RlJyk7XG5cdH1cblxuXHQkKFwiI3ZpZGVvLWNvbnRhaW5lciAuc2xpY2stcHJldi1hcnJvd1wiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdCQoXCIudmlkZW8tc2xpZGVcIikuc2xpY2soJ3NsaWNrUHJldicpO1xuXHR9KVxuXG5cdCQoXCIjdmlkZW8tY29udGFpbmVyIC5zbGljay1uZXh0LWFycm93XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0JChcIi52aWRlby1zbGlkZVwiKS5zbGljaygnc2xpY2tOZXh0Jyk7XG5cdH0pXG5cblx0JChcIiN2aWRlby1jb250YWluZXIgLnZpZGVvXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHNyYyA9ICQodGhpcykuYXR0cigndmlkJyk7XG5cdFx0cG9wdXAoc3JjKTtcblx0fSlcblxuXHR2YXIgaWR4ID0gJChcImJvZHlcIikuYXR0cihcImlkeFwiKTtcblxuXHQkKFwiI21haW4tbmF2YmFyIGxpIGFbaWR4PSdcIiArIGlkeCArIFwiJ11cIikuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cdHZhciBoID0gcGFyc2VJbnQoJCh3aW5kb3cpLmhlaWdodCgpIC0gMjUwKTtcblx0JChcIi5zaXRlLWNvbnRlbnRcIikuY3NzKCdtaW4taGVpZ2h0JywgaCk7XG5cdCQoXCJmb290ZXJcIikuc2hvdygpO1xuXG5cdCQoXCIucGFnZS1ldmVudHMgLm90aGVyLWV2ZW50cyBwXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBpZHggPSAkKHRoaXMpLmF0dHIoJ2luZGV4Jyk7XG5cdFx0JChcIi5wYWdlLWV2ZW50cyAubWFpbi1ldmVudFwiKS5odG1sKCQoXCIucGFnZS1ldmVudHMgLmRldGFpbHMgLml0ZW1baW5kZXg9XCIgKyBpZHggKyBcIl1cIikuaHRtbCgpKTtcblx0fSlcblxuXHRmdW5jdGlvbiBwb3B1cChzcmMpIHtcblx0XHR2YXIgdiA9IFwiPHZpZGVvIHdpZHRoPSc1NDAnIGhlaWdodD0nMzQwJyBzcmM9J1wiICsgdmlkZW9zW3NyY10gKyBcIic+PC92aWRlbz5cIjtcblxuXHRcdHZhciB2YyA9ICQoXCIudmlkZW8tbW9kYWwgLnZpZGVvLWNcIikuaHRtbCh2KTtcblx0XHQvLyAkKFwiI3YxXCIpLmFwcGVuZFRvKHZjKTtcblx0XHR3aW5kb3cucGxheWVyID0gbmV3IE1lZGlhRWxlbWVudFBsYXllcignLnZpZGVvLW1vZGFsIHZpZGVvJyk7XG5cdFx0JChcIi52aWRlby1tb2RhbFwiKS5tb2RhbCgpO1xuXHRcdHdpbmRvdy5wbGF5ZXIucGxheSgpO1xuXG5cdFx0JChcIi52aWRlby1tb2RhbFwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0d2luZG93LnBsYXllci5wYXVzZSgpO1xuXHRcdFx0JChcIi52aWRlby1tb2RhbCAudmlkZW8tY1wiKS5lbXB0eSgpO1xuXHRcdH0pXG5cdH1cbn0pIl19
