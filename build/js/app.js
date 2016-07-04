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

		$(".video-modal").click(function(e){
			var outer = $(e.target).find(".modal-dialog").length > 0;
			if(outer){
				window.player.pause();
				$(".video-modal .video-c").empty();
			}

		})
	}
})
},{}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29mZmVlLmpzIiwic3JjL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgTU9CSUxFX0JSRUFLX1BPSU5ULCBmb250U2l6ZURldGVjdG9yLCBtb2JpbGVEZXRlY3RvcjtcblxuTU9CSUxFX0JSRUFLX1BPSU5UID0gNzY4O1xuXG5mb250U2l6ZURldGVjdG9yID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjbGllbnRXaWR0aCwgZG9jRWw7XG4gIGRvY0VsID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICBjbGllbnRXaWR0aCA9IGRvY0VsLmNsaWVudFdpZHRoO1xuICBpZiAoIWNsaWVudFdpZHRoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJldHVybiBkb2NFbC5zdHlsZS5mb250U2l6ZSA9IDIwICogKGNsaWVudFdpZHRoIC8gMzIwKSArICdweCc7XG59O1xuXG5tb2JpbGVEZXRlY3RvciA9IGZ1bmN0aW9uKCkge1xuICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPCBNT0JJTEVfQlJFQUtfUE9JTlQpIHtcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ21vYmlsZS12aWV3Jyk7XG4gICAgcmV0dXJuIGZvbnRTaXplRGV0ZWN0b3IoKTtcbiAgfSBlbHNlIHtcbiAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ21vYmlsZS12aWV3Jyk7XG4gICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5mb250U2l6ZSA9IDIwICsgJ3B4JztcbiAgfVxufTtcblxuJCh3aW5kb3cpLm9uKCdyZXNpemUgb3JpZW50YXRpb25jaGFuZ2UnLCBtb2JpbGVEZXRlY3Rvcik7XG5cbm1vYmlsZURldGVjdG9yKCk7IiwiJChmdW5jdGlvbigpIHtcblx0dmFyIHcgPSAkKHdpbmRvdykud2lkdGgoKTtcblxuXHR2YXIgdmlkZW9zID0ge1xuXHRcdHYxIDogXCJodHRwOi8vc3RvcmFnZS5ldmVudHNsaW4uY29tL+S6kuiBlOe9kemHkeiejeS4juaUr+S7mOWIm+aWsC5tcDRcIixcblx0XHR2MiA6IFwiaHR0cDovL3N0b3JhZ2UuZXZlbnRzbGluLmNvbS/kuLvpopjlhazlm63oirHnta4ubXA0XCJcblx0fVxuXG5cdCQoXCIjYmFubmVyIC5zbGlkZVwiKS5zbGljayh7XG5cdFx0c2xpZGVzVG9TaG93OiAxLFxuICBcdFx0c2xpZGVzVG9TY3JvbGw6IDEsXG4gIFx0XHRhZGFwdGl2ZUhlaWdodDogdHJ1ZSxcbiAgXHRcdGxhenlMb2FkOiAnb25kZW1hbmQnLFxuICBcdFx0cHJldkFycm93IDogXCI8ZGl2IGNsYXNzPSdzbGljay1wcmV2LWFycm93IHNsaWNrLWFycm93Jz48aW1nIHNyYz0nLi4vaW1nL2Fycm93LWwucG5nJz48L2Rpdj5cIixcbiAgICAgICAgbmV4dEFycm93IDogXCI8ZGl2IGNsYXNzPSdzbGljay1uZXh0LWFycm93IHNsaWNrLWFycm93Jz48aW1nIHNyYz0nLi4vaW1nL2Fycm93LXIucG5nJz48L2Rpdj5cIlxuXHR9KVxuXG5cdCQoXCIjYmFubmVyIC5ib3R0b20tYmxvY2sgbGlcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHR2YXIgc2lkID0gJCh0aGlzKS5hdHRyKCdzaWQnKTtcblx0XHQkKFwiI2Jhbm5lciAuc2xpZGVcIikuc2xpY2soJ3NsaWNrR29UbycsIHNpZCk7XG5cdFx0JChcIiNiYW5uZXIgLmJvdHRvbS1ibG9jayBsaS5hY3RpdmVcIikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHR9KVxuXG5cdCQoXCIjYmFubmVyIC5zbGlkZVwiKS5vbignYWZ0ZXJDaGFuZ2UnLCBmdW5jdGlvbihwYXJhbSl7XG5cdFx0dmFyIHNpZCA9ICQoXCIjYmFubmVyIC5zbGlkZSAuc2xpY2stYWN0aXZlXCIpLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnKTtcblx0XHQkKFwiI2Jhbm5lciAuYm90dG9tLWJsb2NrIGxpLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0JChcIiNiYW5uZXIgLmJvdHRvbS1ibG9jayBsaVtzaWQ9XCIgKyBzaWQgKyBcIl1cIikuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHR9KVxuXG5cdHZhciBzbiA9IHcgPiAxNjAwID8gNCA6IDM7XG5cblx0JChcIi52aWRlby1zbGlkZVwiKS5zbGljayh7XG5cdFx0c2xpZGVzVG9TaG93OiBzbixcbiAgXHRcdHNsaWRlc1RvU2Nyb2xsOiAxLFxuICBcdFx0YXJyb3dzOiBmYWxzZVxuXHR9KTtcblxuXHRpZih3ID4gMTYwMCl7XG5cdFx0JChcIiN2aWRlby1jb250YWluZXJcIikuYWRkQ2xhc3MoJ3dpZGUtbW9kZScpO1xuXHR9XG5cblx0JChcIiN2aWRlby1jb250YWluZXIgLnNsaWNrLXByZXYtYXJyb3dcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHQkKFwiLnZpZGVvLXNsaWRlXCIpLnNsaWNrKCdzbGlja1ByZXYnKTtcblx0fSlcblxuXHQkKFwiI3ZpZGVvLWNvbnRhaW5lciAuc2xpY2stbmV4dC1hcnJvd1wiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdCQoXCIudmlkZW8tc2xpZGVcIikuc2xpY2soJ3NsaWNrTmV4dCcpO1xuXHR9KVxuXG5cdCQoXCIjdmlkZW8tY29udGFpbmVyIC52aWRlb1wiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdHZhciBzcmMgPSAkKHRoaXMpLmF0dHIoJ3ZpZCcpO1xuXHRcdHBvcHVwKHNyYyk7XG5cdH0pXG5cblx0dmFyIGlkeCA9ICQoXCJib2R5XCIpLmF0dHIoXCJpZHhcIik7XG5cblx0JChcIiNtYWluLW5hdmJhciBsaSBhW2lkeD0nXCIgKyBpZHggKyBcIiddXCIpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuXHR2YXIgaCA9IHBhcnNlSW50KCQod2luZG93KS5oZWlnaHQoKSAtIDI1MCk7XG5cdCQoXCIuc2l0ZS1jb250ZW50XCIpLmNzcygnbWluLWhlaWdodCcsIGgpO1xuXHQkKFwiZm9vdGVyXCIpLnNob3coKTtcblxuXHQkKFwiLnBhZ2UtZXZlbnRzIC5vdGhlci1ldmVudHMgcFwiKS5jbGljayhmdW5jdGlvbigpIHtcblx0XHR2YXIgaWR4ID0gJCh0aGlzKS5hdHRyKCdpbmRleCcpO1xuXHRcdCQoXCIucGFnZS1ldmVudHMgLm1haW4tZXZlbnRcIikuaHRtbCgkKFwiLnBhZ2UtZXZlbnRzIC5kZXRhaWxzIC5pdGVtW2luZGV4PVwiICsgaWR4ICsgXCJdXCIpLmh0bWwoKSk7XG5cdH0pXG5cblx0ZnVuY3Rpb24gcG9wdXAoc3JjKSB7XG5cdFx0dmFyIHYgPSBcIjx2aWRlbyB3aWR0aD0nNTQwJyBoZWlnaHQ9JzM0MCcgc3JjPSdcIiArIHZpZGVvc1tzcmNdICsgXCInPjwvdmlkZW8+XCI7XG5cblx0XHR2YXIgdmMgPSAkKFwiLnZpZGVvLW1vZGFsIC52aWRlby1jXCIpLmh0bWwodik7XG5cdFx0Ly8gJChcIiN2MVwiKS5hcHBlbmRUbyh2Yyk7XG5cdFx0d2luZG93LnBsYXllciA9IG5ldyBNZWRpYUVsZW1lbnRQbGF5ZXIoJy52aWRlby1tb2RhbCB2aWRlbycpO1xuXHRcdCQoXCIudmlkZW8tbW9kYWxcIikubW9kYWwoKTtcblx0XHR3aW5kb3cucGxheWVyLnBsYXkoKTtcblxuXHRcdCQoXCIudmlkZW8tbW9kYWxcIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0XHR2YXIgb3V0ZXIgPSAkKGUudGFyZ2V0KS5maW5kKFwiLm1vZGFsLWRpYWxvZ1wiKS5sZW5ndGggPiAwO1xuXHRcdFx0aWYob3V0ZXIpe1xuXHRcdFx0XHR3aW5kb3cucGxheWVyLnBhdXNlKCk7XG5cdFx0XHRcdCQoXCIudmlkZW8tbW9kYWwgLnZpZGVvLWNcIikuZW1wdHkoKTtcblx0XHRcdH1cblxuXHRcdH0pXG5cdH1cbn0pIl19
