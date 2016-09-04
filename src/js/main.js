$(function() {
	var w = $(window).width();

	var videos = {
		v1 : "http://storage.eventslin.com/决策者敲钟仪式.MP4",
		v2 : "http://storage.eventslin.com/CDMC风采集锦-3.mp4",
		v3 : "http://storage.eventslin.com/主题公园花絮.mp4",
		v4 : "http://storage.eventslin.com/深圳希尔顿油会.MP4",
		v5 : "http://storage.eventslin.com/互联网金融与支付创新.mp4",
		v6 : "http://storage.eventslin.com/绿色汽车.MP4",
		v7 : "http://storage.eventslin.com/决策者最终版.mp4"
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
