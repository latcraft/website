var paginationLarge = false;

var moveHolder = function (item, left) {
	item.css({		
		'-webkit-transform': 'translate3d(' + (left) + '%, 0px, 0px)',
		'-ms-transform': 'translate3d(' + (left) + '%, 0px, 0px)',
		'transform': 'translate3d(' + (left) + '%, 0px, 0px)'
	});
}

var resizeInnerSlide = function (slide, innerSlide) {
	var slider = $(".carousel .speakers").eq(slide);
		height = slider.find("li").eq(innerSlide).outerHeight();

	slider.css("height", height + "px");
}

var resizeSlide = function (slide) {
	var slider = $(".carousel .holder");
		height = slider.find(".slide").eq(slide).outerHeight();

	slider.css("height", height + "px")
}

var addPagination = function () {
	var totalDots = 0;

	if($(window).width() >= 520) {
		paginationLarge = true;
	} else {
		paginationLarge = false;
	}

	$('#events .slide .container').each(function() {
		var $this = $(this),
			pagination = "";

		totalDots = $this.find('.speakers li').length;
		if($(window).width() >= 520) totalDots /= 3;

		for (var index = 0; index < totalDots; index++) {
			if (index == 0) pagination += '<li class="active"><a href="#' + index + '" data-item="' + index + '">' + index + '</a></li>';
			else pagination += '<li><a href="#' + index + '" data-item="' + index + '">' + index + '</a></li>'; 		 	
		};

		$this.find('.pagination ul').html(pagination);		
	}); 
}


$(document).ready(function() {

	var curSlide = 0,		
		sliderHolder = $('#events .holder'),
		totalSlides = sliderHolder.find('.slide').length;		

	// resize
	if($(window).width() < 520) {
		$('#events .slide .container').each(function() {
			var $this = $(this),
				height = $this.find(".speakers li").eq(0).outerHeight();

			$this.find(".speakers").css("height", height + "px");	
		}); 
	};
	resizeSlide(curSlide);

	$(window).resize(function() {
		resizeSlide(curSlide);
		if($(window).width() >= 520 && paginationLarge == false) {
			$(".carousel .speakers").css({'height':'auto'});
		}
		if(($(window).width() >= 520 && paginationLarge == false) || ($(window).width() < 520 && paginationLarge == true)) {
			addPagination();
			moveHolder($(".carousel .speakers"), 0);
		};
	});

	// outer slider
	$('#events .prev, #events .next').click(function(){
		var $this = $(this);

		if($this.hasClass('next')) {
			if(curSlide == 0) return;			
			curSlide--;
			moveHolder(sliderHolder, (9 - curSlide) * -10);	
			
			// checks if there is no where to slide
			if(curSlide == 0) $this.addClass('inactive');		
				
		} else {
			if(curSlide == totalSlides - 1) return;
			curSlide++;
			moveHolder(sliderHolder, (9 - curSlide) * -10);
			
			// add class inactive if last slide
			if(curSlide == totalSlides - 1) $this.addClass('inactive');							
		}		

		// checks if there is no where to slide
		if(curSlide != totalSlides - 1 && curSlide != 0) {
			$('#events .prev, #events .next').removeClass('inactive');	
		}

		resizeSlide(curSlide);

		return false;
	});	

	// pagination
	addPagination();
	$("body").on( "click", "#events .pagination a", function() {
		var $this = $(this),
			curInnerSlide = $this.attr('data-item'); // get current slide

		$(this).parent().addClass('active').siblings().removeClass('active');		

		if($(window).width() >= 520) {
			moveHolder($this.parents('.pagination').prev(), curInnerSlide * -30);	
			$(".carousel .speakers").eq(curSlide).css("height", "auto");
		} else {
			moveHolder($this.parents('.pagination').prev(), curInnerSlide * -10);	
			resizeInnerSlide(curSlide, curInnerSlide);
		};
		
		resizeSlide(curSlide);
	});
});

