$(function() {
	$("#banner .slide").slick({
		slidesToShow: 1,
  		slidesToScroll: 1,
  		adaptiveHeight: true,
  		prevArrow : "<div class='slick-prev-arrow slick-arrow'><i class='glyphicon glyphicon-chevron-left'></i></div>",
        nextArrow : "<div class='slick-next-arrow slick-arrow'><i class='glyphicon glyphicon-chevron-right'></i></div>",
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


	$(".video-slide").slick({
		slidesToShow: 4,
  		slidesToScroll: 2
	});
})