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
		v1 : "http://storage.eventslin.com/互联网金融与支付创新.mp4",
		v2 : "http://storage.eventslin.com/主题公园花絮.mp4"
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29mZmVlLmpzIiwic3JjL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIE1PQklMRV9CUkVBS19QT0lOVCwgZm9udFNpemVEZXRlY3RvciwgbW9iaWxlRGV0ZWN0b3I7XG5cbk1PQklMRV9CUkVBS19QT0lOVCA9IDc2ODtcblxuZm9udFNpemVEZXRlY3RvciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY2xpZW50V2lkdGgsIGRvY0VsO1xuICBkb2NFbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgY2xpZW50V2lkdGggPSBkb2NFbC5jbGllbnRXaWR0aDtcbiAgaWYgKCFjbGllbnRXaWR0aCkge1xuICAgIHJldHVybjtcbiAgfVxuICByZXR1cm4gZG9jRWwuc3R5bGUuZm9udFNpemUgPSAyMCAqIChjbGllbnRXaWR0aCAvIDMyMCkgKyAncHgnO1xufTtcblxubW9iaWxlRGV0ZWN0b3IgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgTU9CSUxFX0JSRUFLX1BPSU5UKSB7XG4gICAgJCgnYm9keScpLmFkZENsYXNzKCdtb2JpbGUtdmlldycpO1xuICAgIHJldHVybiBmb250U2l6ZURldGVjdG9yKCk7XG4gIH0gZWxzZSB7XG4gICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdtb2JpbGUtdmlldycpO1xuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSAyMCArICdweCc7XG4gIH1cbn07XG5cbiQod2luZG93KS5vbigncmVzaXplIG9yaWVudGF0aW9uY2hhbmdlJywgbW9iaWxlRGV0ZWN0b3IpO1xuXG5tb2JpbGVEZXRlY3RvcigpOyIsIiQoZnVuY3Rpb24oKSB7XG5cdHZhciB3ID0gJCh3aW5kb3cpLndpZHRoKCk7XG5cblx0dmFyIHZpZGVvcyA9IHtcblx0XHR2MSA6IFwiaHR0cDovL3N0b3JhZ2UuZXZlbnRzbGluLmNvbS/kupLogZTnvZHph5Hono3kuI7mlK/ku5jliJvmlrAubXA0XCIsXG5cdFx0djIgOiBcImh0dHA6Ly9zdG9yYWdlLmV2ZW50c2xpbi5jb20v5Li76aKY5YWs5Zut6Iqx57WuLm1wNFwiXG5cdH1cblxuXHQkKFwiI2Jhbm5lciAuc2xpZGVcIikuc2xpY2soe1xuXHRcdHNsaWRlc1RvU2hvdzogMSxcbiAgXHRcdHNsaWRlc1RvU2Nyb2xsOiAxLFxuICBcdFx0YWRhcHRpdmVIZWlnaHQ6IHRydWUsXG4gIFx0XHRsYXp5TG9hZDogJ29uZGVtYW5kJyxcbiAgXHRcdHByZXZBcnJvdyA6IFwiPGRpdiBjbGFzcz0nc2xpY2stcHJldi1hcnJvdyBzbGljay1hcnJvdyc+PGltZyBzcmM9Jy4uL2ltZy9hcnJvdy1sLnBuZyc+PC9kaXY+XCIsXG4gICAgICAgIG5leHRBcnJvdyA6IFwiPGRpdiBjbGFzcz0nc2xpY2stbmV4dC1hcnJvdyBzbGljay1hcnJvdyc+PGltZyBzcmM9Jy4uL2ltZy9hcnJvdy1yLnBuZyc+PC9kaXY+XCJcblx0fSlcblxuXHQkKFwiI2Jhbm5lciAuYm90dG9tLWJsb2NrIGxpXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHNpZCA9ICQodGhpcykuYXR0cignc2lkJyk7XG5cdFx0JChcIiNiYW5uZXIgLnNsaWRlXCIpLnNsaWNrKCdzbGlja0dvVG8nLCBzaWQpO1xuXHRcdCQoXCIjYmFubmVyIC5ib3R0b20tYmxvY2sgbGkuYWN0aXZlXCIpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0fSlcblxuXHQkKFwiI2Jhbm5lciAuc2xpZGVcIikub24oJ2FmdGVyQ2hhbmdlJywgZnVuY3Rpb24ocGFyYW0pe1xuXHRcdHZhciBzaWQgPSAkKFwiI2Jhbm5lciAuc2xpZGUgLnNsaWNrLWFjdGl2ZVwiKS5hdHRyKCdkYXRhLXNsaWNrLWluZGV4Jyk7XG5cdFx0JChcIiNiYW5uZXIgLmJvdHRvbS1ibG9jayBsaS5hY3RpdmVcIikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdCQoXCIjYmFubmVyIC5ib3R0b20tYmxvY2sgbGlbc2lkPVwiICsgc2lkICsgXCJdXCIpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0fSlcblxuXHR2YXIgc24gPSB3ID4gMTYwMCA/IDQgOiAzO1xuXG5cdCQoXCIudmlkZW8tc2xpZGVcIikuc2xpY2soe1xuXHRcdHNsaWRlc1RvU2hvdzogc24sXG4gIFx0XHRzbGlkZXNUb1Njcm9sbDogMSxcbiAgXHRcdGFycm93czogZmFsc2Vcblx0fSk7XG5cblx0aWYodyA+IDE2MDApe1xuXHRcdCQoXCIjdmlkZW8tY29udGFpbmVyXCIpLmFkZENsYXNzKCd3aWRlLW1vZGUnKTtcblx0fVxuXG5cdCQoXCIjdmlkZW8tY29udGFpbmVyIC5zbGljay1wcmV2LWFycm93XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0JChcIi52aWRlby1zbGlkZVwiKS5zbGljaygnc2xpY2tQcmV2Jyk7XG5cdH0pXG5cblx0JChcIiN2aWRlby1jb250YWluZXIgLnNsaWNrLW5leHQtYXJyb3dcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHQkKFwiLnZpZGVvLXNsaWRlXCIpLnNsaWNrKCdzbGlja05leHQnKTtcblx0fSlcblxuXHQkKFwiI3ZpZGVvLWNvbnRhaW5lciAudmlkZW9cIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHR2YXIgc3JjID0gJCh0aGlzKS5hdHRyKCd2aWQnKTtcblx0XHRwb3B1cChzcmMpO1xuXHR9KVxuXG5cdHZhciBpZHggPSAkKFwiYm9keVwiKS5hdHRyKFwiaWR4XCIpO1xuXG5cdCQoXCIjbWFpbi1uYXZiYXIgbGkgYVtpZHg9J1wiICsgaWR4ICsgXCInXVwiKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cblx0dmFyIGggPSBwYXJzZUludCgkKHdpbmRvdykuaGVpZ2h0KCkgLSAyNTApO1xuXHQkKFwiLnNpdGUtY29udGVudFwiKS5jc3MoJ21pbi1oZWlnaHQnLCBoKTtcblx0JChcImZvb3RlclwiKS5zaG93KCk7XG5cblx0JChcIi5wYWdlLWV2ZW50cyAub3RoZXItZXZlbnRzIHBcIikuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGlkeCA9ICQodGhpcykuYXR0cignaW5kZXgnKTtcblx0XHQkKFwiLnBhZ2UtZXZlbnRzIC5tYWluLWV2ZW50XCIpLmh0bWwoJChcIi5wYWdlLWV2ZW50cyAuZGV0YWlscyAuaXRlbVtpbmRleD1cIiArIGlkeCArIFwiXVwiKS5odG1sKCkpO1xuXHR9KVxuXG5cdGZ1bmN0aW9uIHBvcHVwKHNyYykge1xuXHRcdHZhciB2ID0gXCI8dmlkZW8gd2lkdGg9JzU0MCcgaGVpZ2h0PSczNDAnIHNyYz0nXCIgKyB2aWRlb3Nbc3JjXSArIFwiJz48L3ZpZGVvPlwiO1xuXG5cdFx0dmFyIHZjID0gJChcIi52aWRlby1tb2RhbCAudmlkZW8tY1wiKS5odG1sKHYpO1xuXHRcdC8vICQoXCIjdjFcIikuYXBwZW5kVG8odmMpO1xuXHRcdHdpbmRvdy5wbGF5ZXIgPSBuZXcgTWVkaWFFbGVtZW50UGxheWVyKCcudmlkZW8tbW9kYWwgdmlkZW8nKTtcblx0XHQkKFwiLnZpZGVvLW1vZGFsXCIpLm1vZGFsKCk7XG5cdFx0d2luZG93LnBsYXllci5wbGF5KCk7XG5cblx0XHQkKFwiLnZpZGVvLW1vZGFsXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0XHR3aW5kb3cucGxheWVyLnBhdXNlKCk7XG5cdFx0XHQkKFwiLnZpZGVvLW1vZGFsIC52aWRlby1jXCIpLmVtcHR5KCk7XG5cdFx0fSlcblx0fVxufSkiXX0=
