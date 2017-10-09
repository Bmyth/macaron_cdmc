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

	$("#main-navbar li a[idx='" + idx + "']").addClass('active');

	var h = parseInt($(window).height() - 250);
	$(".site-content").css('min-height', h);
	$("footer").show();

	$(".page-events .other-events p").click(function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29mZmVlLmpzIiwic3JjL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBNT0JJTEVfQlJFQUtfUE9JTlQsIGZvbnRTaXplRGV0ZWN0b3IsIG1vYmlsZURldGVjdG9yO1xyXG5cclxuTU9CSUxFX0JSRUFLX1BPSU5UID0gNzY4O1xyXG5cclxuZm9udFNpemVEZXRlY3RvciA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBjbGllbnRXaWR0aCwgZG9jRWw7XHJcbiAgZG9jRWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgY2xpZW50V2lkdGggPSBkb2NFbC5jbGllbnRXaWR0aDtcclxuICBpZiAoIWNsaWVudFdpZHRoKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHJldHVybiBkb2NFbC5zdHlsZS5mb250U2l6ZSA9IDIwICogKGNsaWVudFdpZHRoIC8gMzIwKSArICdweCc7XHJcbn07XHJcblxyXG5tb2JpbGVEZXRlY3RvciA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICgkKHdpbmRvdykud2lkdGgoKSA8IE1PQklMRV9CUkVBS19QT0lOVCkge1xyXG4gICAgJCgnYm9keScpLmFkZENsYXNzKCdtb2JpbGUtdmlldycpO1xyXG4gICAgJCgnLmNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKCdjb250YWluZXInKS5hZGRDbGFzcygnY29udGFpbmVyLWZsdWlkJyk7XHJcbiAgICByZXR1cm4gZm9udFNpemVEZXRlY3RvcigpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ21vYmlsZS12aWV3Jyk7XHJcbiAgICAkKCcuY29udGFpbmVyLWZsdWlkJykucmVtb3ZlQ2xhc3MoJ2NvbnRhaW5lci1mbHVpZCcpLmFkZENsYXNzKCdjb250YWluZXInKTtcclxuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSAyMCArICdweCc7XHJcbiAgfVxyXG59O1xyXG5cclxuJCh3aW5kb3cpLm9uKCdyZXNpemUgb3JpZW50YXRpb25jaGFuZ2UnLCBtb2JpbGVEZXRlY3Rvcik7XHJcblxyXG5tb2JpbGVEZXRlY3RvcigpOyIsIiQoZnVuY3Rpb24gKCkge1xyXG5cdHZhciB3ID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcblxyXG5cdHZhciB2aWRlb3MgPSB7XHJcblx0XHR2MTogXCJodHRwOi8vc3RvcmFnZS5ldmVudHNsaW4uY29tL+WGs+etluiAheaVsumSn+S7quW8jy5NUDRcIixcclxuXHRcdHYyOiBcImh0dHA6Ly9zdG9yYWdlLmV2ZW50c2xpbi5jb20vQ0RNQ+mjjumHh+mbhumUpi0zLm1wNFwiLFxyXG5cdFx0djM6IFwiaHR0cDovL3N0b3JhZ2UuZXZlbnRzbGluLmNvbS/kuLvpopjlhazlm63oirHnta4ubXA0XCIsXHJcblx0XHR2NDogXCJodHRwOi8vc3RvcmFnZS5ldmVudHNsaW4uY29tL+a3seWcs+W4jOWwlOmhv+ayueS8mi5NUDRcIixcclxuXHRcdHY1OiBcImh0dHA6Ly9zdG9yYWdlLmV2ZW50c2xpbi5jb20v5LqS6IGU572R6YeR6J6N5LiO5pSv5LuY5Yib5pawLm1wNFwiLFxyXG5cdFx0djY6IFwiaHR0cDovL3N0b3JhZ2UuZXZlbnRzbGluLmNvbS/nu7/oibLmsb3ovaYuTVA0XCIsXHJcblx0XHR2NzogXCJodHRwOi8vc3RvcmFnZS5ldmVudHNsaW4uY29tL+WGs+etluiAheacgOe7iOeJiC5tcDRcIlxyXG5cdH1cclxuXHJcblx0JChcIiNiYW5uZXIgLnNsaWRlXCIpLnNsaWNrKHtcclxuXHRcdHNsaWRlc1RvU2hvdzogMSxcclxuXHRcdHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG5cdFx0YWRhcHRpdmVIZWlnaHQ6IHRydWUsXHJcblx0XHRtb2JpbGVGaXJzdDogdHJ1ZSxcclxuXHRcdGxhenlMb2FkOiAnb25kZW1hbmQnLFxyXG5cdFx0cHJldkFycm93OiBcIjxkaXYgY2xhc3M9J3NsaWNrLXByZXYtYXJyb3cgc2xpY2stYXJyb3cnPjxpbWcgc3JjPScuLi9pbWcvYXJyb3ctbC5wbmcnPjwvZGl2PlwiLFxyXG5cdFx0bmV4dEFycm93OiBcIjxkaXYgY2xhc3M9J3NsaWNrLW5leHQtYXJyb3cgc2xpY2stYXJyb3cnPjxpbWcgc3JjPScuLi9pbWcvYXJyb3ctci5wbmcnPjwvZGl2PlwiXHJcblx0fSlcclxuXHJcblx0JChcIiNiYW5uZXIgLmJvdHRvbS1ibG9jayBsaVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgc2lkID0gJCh0aGlzKS5hdHRyKCdzaWQnKTtcclxuXHRcdCQoXCIjYmFubmVyIC5zbGlkZVwiKS5zbGljaygnc2xpY2tHb1RvJywgc2lkKTtcclxuXHRcdCQoXCIjYmFubmVyIC5ib3R0b20tYmxvY2sgbGkuYWN0aXZlXCIpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdH0pXHJcblxyXG5cdCQoXCIjYmFubmVyIC5zbGlkZVwiKS5vbignYWZ0ZXJDaGFuZ2UnLCBmdW5jdGlvbiAocGFyYW0pIHtcclxuXHRcdHZhciBzaWQgPSAkKFwiI2Jhbm5lciAuc2xpZGUgLnNsaWNrLWFjdGl2ZVwiKS5hdHRyKCdkYXRhLXNsaWNrLWluZGV4Jyk7XHJcblx0XHQkKFwiI2Jhbm5lciAuYm90dG9tLWJsb2NrIGxpLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHQkKFwiI2Jhbm5lciAuYm90dG9tLWJsb2NrIGxpW3NpZD1cIiArIHNpZCArIFwiXVwiKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0fSlcclxuXHJcblx0dmFyIHNuID0gdyA+IDE2MDAgPyA0IDogMztcclxuXHJcblx0JChcIi52aWRlby1zbGlkZVwiKS5zbGljayh7XHJcblx0XHRzbGlkZXNUb1Nob3c6IHNuLFxyXG5cdFx0c2xpZGVzVG9TY3JvbGw6IDEsXHJcblx0XHRhcnJvd3M6IGZhbHNlLFxyXG5cdFx0bW9iaWxlRmlyc3Q6IHRydWVcclxuXHR9KTtcclxuXHJcblx0aWYgKHcgPiAxNjAwKSB7XHJcblx0XHQkKFwiI3ZpZGVvLWNvbnRhaW5lclwiKS5hZGRDbGFzcygnd2lkZS1tb2RlJyk7XHJcblx0fVxyXG5cclxuXHQkKFwiI3ZpZGVvLWNvbnRhaW5lciAuc2xpY2stcHJldi1hcnJvd1wiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHQkKFwiLnZpZGVvLXNsaWRlXCIpLnNsaWNrKCdzbGlja1ByZXYnKTtcclxuXHR9KVxyXG5cclxuXHQkKFwiI3ZpZGVvLWNvbnRhaW5lciAuc2xpY2stbmV4dC1hcnJvd1wiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHQkKFwiLnZpZGVvLXNsaWRlXCIpLnNsaWNrKCdzbGlja05leHQnKTtcclxuXHR9KVxyXG5cclxuXHQkKFwiI3ZpZGVvLWNvbnRhaW5lciAudmlkZW9cIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHNyYyA9ICQodGhpcykuYXR0cigndmlkJyk7XHJcblx0XHRwb3B1cChzcmMpO1xyXG5cdH0pXHJcblxyXG5cdHZhciBpZHggPSAkKFwiYm9keVwiKS5hdHRyKFwiaWR4XCIpO1xyXG5cclxuXHQkKFwiI21haW4tbmF2YmFyIGxpIGFbaWR4PSdcIiArIGlkeCArIFwiJ11cIikuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuXHR2YXIgaCA9IHBhcnNlSW50KCQod2luZG93KS5oZWlnaHQoKSAtIDI1MCk7XHJcblx0JChcIi5zaXRlLWNvbnRlbnRcIikuY3NzKCdtaW4taGVpZ2h0JywgaCk7XHJcblx0JChcImZvb3RlclwiKS5zaG93KCk7XHJcblxyXG5cdCQoXCIucGFnZS1ldmVudHMgLm90aGVyLWV2ZW50cyBwXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBpZHggPSAkKHRoaXMpLmF0dHIoJ2luZGV4Jyk7XHJcblx0XHQkKFwiLnBhZ2UtZXZlbnRzIC5tYWluLWV2ZW50XCIpLmh0bWwoJChcIi5wYWdlLWV2ZW50cyAuZGV0YWlscyAuaXRlbVtpbmRleD1cIiArIGlkeCArIFwiXVwiKS5odG1sKCkpO1xyXG5cdH0pXHJcblxyXG5cdGZ1bmN0aW9uIHBvcHVwKHNyYykge1xyXG5cdFx0dmFyIHYgPSBcIjx2aWRlbyB3aWR0aD0nNTQwJyBoZWlnaHQ9JzM0MCcgc3JjPSdcIiArIHZpZGVvc1tzcmNdICsgXCInPjwvdmlkZW8+XCI7XHJcblxyXG5cdFx0dmFyIHZjID0gJChcIi52aWRlby1tb2RhbCAudmlkZW8tY1wiKS5odG1sKHYpO1xyXG5cdFx0Ly8gJChcIiN2MVwiKS5hcHBlbmRUbyh2Yyk7XHJcblx0XHR3aW5kb3cucGxheWVyID0gbmV3IE1lZGlhRWxlbWVudFBsYXllcignLnZpZGVvLW1vZGFsIHZpZGVvJyk7XHJcblx0XHQkKFwiLnZpZGVvLW1vZGFsXCIpLm1vZGFsKCk7XHJcblx0XHR3aW5kb3cucGxheWVyLnBsYXkoKTtcclxuXHJcblx0XHQkKFwiLnZpZGVvLW1vZGFsXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdHZhciBvdXRlciA9ICQoZS50YXJnZXQpLmZpbmQoXCIubW9kYWwtZGlhbG9nXCIpLmxlbmd0aCA+IDA7XHJcblx0XHRcdGlmIChvdXRlcikge1xyXG5cdFx0XHRcdHdpbmRvdy5wbGF5ZXIucGF1c2UoKTtcclxuXHRcdFx0XHQkKFwiLnZpZGVvLW1vZGFsIC52aWRlby1jXCIpLmVtcHR5KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KVxyXG5cdH1cclxufSlcclxuIl19
