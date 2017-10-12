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
    $('.container').removeClass('container').addClass('container-fluid');
    return fontSizeDetector();
  } else {
    $('body').removeClass('mobile-view');
    $('.container-fluid').removeClass('container-fluid').addClass('container');
    return document.documentElement.style.fontSize = 20 + 'px';
  }
};

$(window).on('resize orientationchange', mobileDetector);

mobileDetector();
},{}],2:[function(require,module,exports){
$(function () {
	var w = $(window).width();

	var videos = {
		v1: "http://storage.eventslin.com/决策者敲钟仪式.MP4",
		v2: "http://storage.eventslin.com/CDMC风采集锦-3.mp4",
		v3: "http://storage.eventslin.com/主题公园花絮.mp4",
		v4: "http://storage.eventslin.com/深圳希尔顿油会.MP4",
		v5: "http://storage.eventslin.com/互联网金融与支付创新.mp4",
		v6: "http://storage.eventslin.com/绿色汽车.MP4",
		v7: "http://storage.eventslin.com/决策者最终版.mp4"
	}

	$("#banner .slide").slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		adaptiveHeight: true,
		mobileFirst: true,
		lazyLoad: 'ondemand',
		prevArrow: "<div class='slick-prev-arrow slick-arrow'><img src='../img/arrow-l.png'></div>",
		nextArrow: "<div class='slick-next-arrow slick-arrow'><img src='../img/arrow-r.png'></div>"
	})

	$("#banner .bottom-block li").click(function () {
		var sid = $(this).attr('sid');
		$("#banner .slide").slick('slickGoTo', sid);
		$("#banner .bottom-block li.active").removeClass('active');
		$(this).addClass('active');
	})

	$("#banner .slide").on('afterChange', function (param) {
		var sid = $("#banner .slide .slick-active").attr('data-slick-index');
		$("#banner .bottom-block li.active").removeClass('active');
		$("#banner .bottom-block li[sid=" + sid + "]").addClass('active');
	})

	var sn = w > 1600 ? 4 : 3;

	$(".video-slide").slick({
		slidesToShow: sn,
		slidesToScroll: 1,
		arrows: false,
		mobileFirst: true
	});

	if (w > 1600) {
		$("#video-container").addClass('wide-mode');
	}

	$("#video-container .slick-prev-arrow").click(function () {
		$(".video-slide").slick('slickPrev');
	})

	$("#video-container .slick-next-arrow").click(function () {
		$(".video-slide").slick('slickNext');
	})

	$("#video-container .video").click(function () {
		var src = $(this).attr('vid');
		popup(src);
	})

	var idx = $("body").attr("idx");

	$("#main-navbar li a").removeClass('active');
	$("#main-navbar li a[idx='" + idx + "']").addClass('active');

	var h = parseInt($(window).height() - 250);
	$(".site-content").css('min-height', h);
	$("footer").show();

	$(".page-events .other-events p").click(function () {
		var idx = $(this).attr('index');
		$(".page-events .main-event").html($(".page-events .details .item[index=" + idx + "]").html());
	})

	$(".modal-dialog .video-close").click(function () {
		window.player.pause();
		$(".video-modal .video-c").empty();
		$(".video-modal").modal('hide');
	})

	function popup(src) {
		var v = "<video width='540' height='340' src='" + videos[src] + "'></video>";

		var vc = $(".video-modal .video-c").html(v);
		// $("#v1").appendTo(vc);
		window.player = new MediaElementPlayer('.video-modal video');
		$(".video-modal").modal();
		window.player.play();

		$(".video-modal").click(function (e) {
			var outer = $(e.target).find(".modal-dialog").length > 0;
			if (outer) {
				window.player.pause();
				$(".video-modal .video-c").empty();
			}

		})
	}
})

},{}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29mZmVlLmpzIiwic3JjL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIE1PQklMRV9CUkVBS19QT0lOVCwgZm9udFNpemVEZXRlY3RvciwgbW9iaWxlRGV0ZWN0b3I7XG5cbk1PQklMRV9CUkVBS19QT0lOVCA9IDc2ODtcblxuZm9udFNpemVEZXRlY3RvciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY2xpZW50V2lkdGgsIGRvY0VsO1xuICBkb2NFbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgY2xpZW50V2lkdGggPSBkb2NFbC5jbGllbnRXaWR0aDtcbiAgaWYgKCFjbGllbnRXaWR0aCkge1xuICAgIHJldHVybjtcbiAgfVxuICByZXR1cm4gZG9jRWwuc3R5bGUuZm9udFNpemUgPSAyMCAqIChjbGllbnRXaWR0aCAvIDMyMCkgKyAncHgnO1xufTtcblxubW9iaWxlRGV0ZWN0b3IgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgTU9CSUxFX0JSRUFLX1BPSU5UKSB7XG4gICAgJCgnYm9keScpLmFkZENsYXNzKCdtb2JpbGUtdmlldycpO1xuICAgICQoJy5jb250YWluZXInKS5yZW1vdmVDbGFzcygnY29udGFpbmVyJykuYWRkQ2xhc3MoJ2NvbnRhaW5lci1mbHVpZCcpO1xuICAgIHJldHVybiBmb250U2l6ZURldGVjdG9yKCk7XG4gIH0gZWxzZSB7XG4gICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdtb2JpbGUtdmlldycpO1xuICAgICQoJy5jb250YWluZXItZmx1aWQnKS5yZW1vdmVDbGFzcygnY29udGFpbmVyLWZsdWlkJykuYWRkQ2xhc3MoJ2NvbnRhaW5lcicpO1xuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSAyMCArICdweCc7XG4gIH1cbn07XG5cbiQod2luZG93KS5vbigncmVzaXplIG9yaWVudGF0aW9uY2hhbmdlJywgbW9iaWxlRGV0ZWN0b3IpO1xuXG5tb2JpbGVEZXRlY3RvcigpOyIsIiQoZnVuY3Rpb24gKCkge1xuXHR2YXIgdyA9ICQod2luZG93KS53aWR0aCgpO1xuXG5cdHZhciB2aWRlb3MgPSB7XG5cdFx0djE6IFwiaHR0cDovL3N0b3JhZ2UuZXZlbnRzbGluLmNvbS/lhrPnrZbogIXmlbLpkp/ku6rlvI8uTVA0XCIsXG5cdFx0djI6IFwiaHR0cDovL3N0b3JhZ2UuZXZlbnRzbGluLmNvbS9DRE1D6aOO6YeH6ZuG6ZSmLTMubXA0XCIsXG5cdFx0djM6IFwiaHR0cDovL3N0b3JhZ2UuZXZlbnRzbGluLmNvbS/kuLvpopjlhazlm63oirHnta4ubXA0XCIsXG5cdFx0djQ6IFwiaHR0cDovL3N0b3JhZ2UuZXZlbnRzbGluLmNvbS/mt7HlnLPluIzlsJTpob/msrnkvJouTVA0XCIsXG5cdFx0djU6IFwiaHR0cDovL3N0b3JhZ2UuZXZlbnRzbGluLmNvbS/kupLogZTnvZHph5Hono3kuI7mlK/ku5jliJvmlrAubXA0XCIsXG5cdFx0djY6IFwiaHR0cDovL3N0b3JhZ2UuZXZlbnRzbGluLmNvbS/nu7/oibLmsb3ovaYuTVA0XCIsXG5cdFx0djc6IFwiaHR0cDovL3N0b3JhZ2UuZXZlbnRzbGluLmNvbS/lhrPnrZbogIXmnIDnu4jniYgubXA0XCJcblx0fVxuXG5cdCQoXCIjYmFubmVyIC5zbGlkZVwiKS5zbGljayh7XG5cdFx0c2xpZGVzVG9TaG93OiAxLFxuXHRcdHNsaWRlc1RvU2Nyb2xsOiAxLFxuXHRcdGFkYXB0aXZlSGVpZ2h0OiB0cnVlLFxuXHRcdG1vYmlsZUZpcnN0OiB0cnVlLFxuXHRcdGxhenlMb2FkOiAnb25kZW1hbmQnLFxuXHRcdHByZXZBcnJvdzogXCI8ZGl2IGNsYXNzPSdzbGljay1wcmV2LWFycm93IHNsaWNrLWFycm93Jz48aW1nIHNyYz0nLi4vaW1nL2Fycm93LWwucG5nJz48L2Rpdj5cIixcblx0XHRuZXh0QXJyb3c6IFwiPGRpdiBjbGFzcz0nc2xpY2stbmV4dC1hcnJvdyBzbGljay1hcnJvdyc+PGltZyBzcmM9Jy4uL2ltZy9hcnJvdy1yLnBuZyc+PC9kaXY+XCJcblx0fSlcblxuXHQkKFwiI2Jhbm5lciAuYm90dG9tLWJsb2NrIGxpXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgc2lkID0gJCh0aGlzKS5hdHRyKCdzaWQnKTtcblx0XHQkKFwiI2Jhbm5lciAuc2xpZGVcIikuc2xpY2soJ3NsaWNrR29UbycsIHNpZCk7XG5cdFx0JChcIiNiYW5uZXIgLmJvdHRvbS1ibG9jayBsaS5hY3RpdmVcIikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHR9KVxuXG5cdCQoXCIjYmFubmVyIC5zbGlkZVwiKS5vbignYWZ0ZXJDaGFuZ2UnLCBmdW5jdGlvbiAocGFyYW0pIHtcblx0XHR2YXIgc2lkID0gJChcIiNiYW5uZXIgLnNsaWRlIC5zbGljay1hY3RpdmVcIikuYXR0cignZGF0YS1zbGljay1pbmRleCcpO1xuXHRcdCQoXCIjYmFubmVyIC5ib3R0b20tYmxvY2sgbGkuYWN0aXZlXCIpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHQkKFwiI2Jhbm5lciAuYm90dG9tLWJsb2NrIGxpW3NpZD1cIiArIHNpZCArIFwiXVwiKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdH0pXG5cblx0dmFyIHNuID0gdyA+IDE2MDAgPyA0IDogMztcblxuXHQkKFwiLnZpZGVvLXNsaWRlXCIpLnNsaWNrKHtcblx0XHRzbGlkZXNUb1Nob3c6IHNuLFxuXHRcdHNsaWRlc1RvU2Nyb2xsOiAxLFxuXHRcdGFycm93czogZmFsc2UsXG5cdFx0bW9iaWxlRmlyc3Q6IHRydWVcblx0fSk7XG5cblx0aWYgKHcgPiAxNjAwKSB7XG5cdFx0JChcIiN2aWRlby1jb250YWluZXJcIikuYWRkQ2xhc3MoJ3dpZGUtbW9kZScpO1xuXHR9XG5cblx0JChcIiN2aWRlby1jb250YWluZXIgLnNsaWNrLXByZXYtYXJyb3dcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuXHRcdCQoXCIudmlkZW8tc2xpZGVcIikuc2xpY2soJ3NsaWNrUHJldicpO1xuXHR9KVxuXG5cdCQoXCIjdmlkZW8tY29udGFpbmVyIC5zbGljay1uZXh0LWFycm93XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcblx0XHQkKFwiLnZpZGVvLXNsaWRlXCIpLnNsaWNrKCdzbGlja05leHQnKTtcblx0fSlcblxuXHQkKFwiI3ZpZGVvLWNvbnRhaW5lciAudmlkZW9cIikuY2xpY2soZnVuY3Rpb24gKCkge1xuXHRcdHZhciBzcmMgPSAkKHRoaXMpLmF0dHIoJ3ZpZCcpO1xuXHRcdHBvcHVwKHNyYyk7XG5cdH0pXG5cblx0dmFyIGlkeCA9ICQoXCJib2R5XCIpLmF0dHIoXCJpZHhcIik7XG5cblx0JChcIiNtYWluLW5hdmJhciBsaSBhXCIpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0JChcIiNtYWluLW5hdmJhciBsaSBhW2lkeD0nXCIgKyBpZHggKyBcIiddXCIpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuXHR2YXIgaCA9IHBhcnNlSW50KCQod2luZG93KS5oZWlnaHQoKSAtIDI1MCk7XG5cdCQoXCIuc2l0ZS1jb250ZW50XCIpLmNzcygnbWluLWhlaWdodCcsIGgpO1xuXHQkKFwiZm9vdGVyXCIpLnNob3coKTtcblxuXHQkKFwiLnBhZ2UtZXZlbnRzIC5vdGhlci1ldmVudHMgcFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGlkeCA9ICQodGhpcykuYXR0cignaW5kZXgnKTtcblx0XHQkKFwiLnBhZ2UtZXZlbnRzIC5tYWluLWV2ZW50XCIpLmh0bWwoJChcIi5wYWdlLWV2ZW50cyAuZGV0YWlscyAuaXRlbVtpbmRleD1cIiArIGlkeCArIFwiXVwiKS5odG1sKCkpO1xuXHR9KVxuXG5cdCQoXCIubW9kYWwtZGlhbG9nIC52aWRlby1jbG9zZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG5cdFx0d2luZG93LnBsYXllci5wYXVzZSgpO1xuXHRcdCQoXCIudmlkZW8tbW9kYWwgLnZpZGVvLWNcIikuZW1wdHkoKTtcblx0XHQkKFwiLnZpZGVvLW1vZGFsXCIpLm1vZGFsKCdoaWRlJyk7XG5cdH0pXG5cblx0ZnVuY3Rpb24gcG9wdXAoc3JjKSB7XG5cdFx0dmFyIHYgPSBcIjx2aWRlbyB3aWR0aD0nNTQwJyBoZWlnaHQ9JzM0MCcgc3JjPSdcIiArIHZpZGVvc1tzcmNdICsgXCInPjwvdmlkZW8+XCI7XG5cblx0XHR2YXIgdmMgPSAkKFwiLnZpZGVvLW1vZGFsIC52aWRlby1jXCIpLmh0bWwodik7XG5cdFx0Ly8gJChcIiN2MVwiKS5hcHBlbmRUbyh2Yyk7XG5cdFx0d2luZG93LnBsYXllciA9IG5ldyBNZWRpYUVsZW1lbnRQbGF5ZXIoJy52aWRlby1tb2RhbCB2aWRlbycpO1xuXHRcdCQoXCIudmlkZW8tbW9kYWxcIikubW9kYWwoKTtcblx0XHR3aW5kb3cucGxheWVyLnBsYXkoKTtcblxuXHRcdCQoXCIudmlkZW8tbW9kYWxcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcblx0XHRcdHZhciBvdXRlciA9ICQoZS50YXJnZXQpLmZpbmQoXCIubW9kYWwtZGlhbG9nXCIpLmxlbmd0aCA+IDA7XG5cdFx0XHRpZiAob3V0ZXIpIHtcblx0XHRcdFx0d2luZG93LnBsYXllci5wYXVzZSgpO1xuXHRcdFx0XHQkKFwiLnZpZGVvLW1vZGFsIC52aWRlby1jXCIpLmVtcHR5KCk7XG5cdFx0XHR9XG5cblx0XHR9KVxuXHR9XG59KVxuIl19
