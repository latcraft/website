var easyPeasyParallax = function () {
	var scrollPos = $(this).scrollTop();

	$('#header .info').css({
		'margin-top': (scrollPos)+"px",
		'opacity': 1-(scrollPos/250)
	});
}

var easyPeasyNav = function () {
	var scrollPos = $(this).scrollTop();
	var header = $('#header');
	var offCanvas = $('#off-canvas');

	if(scrollPos >= header.height()) {
		offCanvas.addClass("active");
	} else {
		offCanvas.removeClass("active");
	}
}

var centerModal = function () {
	var modal = $("#modal .holder");

	modal.css({
		'margin-top': -(modal.height()/2) +"px"
	});
}

var centerArrow = function (elem) {
	var containerWidth = $("#about .container").width();

	$('#member-nav a').removeClass("active");
	elem.addClass("active");

	$('#member-list ul').removeClass("active");
	$('#member-list ul').eq(parseInt(elem.parent().index()) - 1).addClass("active");

	var itemWidth = elem.width() / 2;
	var thisPos = elem.position();

	// $('#member-nav .arrow').css({
	// 	"left" : ((thisPos.left + itemWidth - 5)/containerWidth) * 100 + "%"
	// });	 
}

$(document).ready(function($) {
	// center modal window 
	centerModal();
	$(window).resize(function() {
		centerModal();
	});


	// fetch one tweet
	var tweetConfig = {
		"id": '558200865941909504',
		"domId": 'twitter-feed',
		"maxTweets": 3,
		"enableLinks": true
	};
	twitterFetcher.fetch(tweetConfig);


	// digest subscription
	$('#subscription form').submit(function(e) {
		var email = $('#subscription input[name=email]').val();
  		var subscribers = new Firebase("https://radiant-fire-3288.firebaseio.com/subscribers");
		
		var subForm = $("#subscription"),
			subError = subForm.find(".error"),
			subSuccess = subForm.find(".success");

		subscribers.push(email, function(error) {
		  if (error) {
			subError.addClass("active");
			subSuccess.removeClass("active");				
		  } else {
			subError.removeClass("active");			
			subSuccess.addClass("active");			
		  }
		});
		e.preventDefault();
	});

	$('#subscription a').click(function() {
	    $(this).parents(".success, .error").removeClass("active");
	});


	// get flickr
	var flickrURL = "http://api.flickr.com/services/feeds/photos_public.gne?ids=128548450@N05&format=json&jsoncallback=?";
	$.getJSON(flickrURL, function(data){
		var imageCollection = "";

		imageCollection += '<ul>';
		for (var item in data.items) {
			if(item == 16) break;
			if(data.items[item].media.m == "http://farm8.staticflickr.com/7381/16470574391_b1bb266ed7_m.jpg") continue;
			imageCollection += '<li><img src="' + data.items[item].media.m + '" alt=""></li>';
		}
		imageCollection += '</ul>';

		$("#flickr-feed").append(imageCollection);
	});


	// display a slider for speakers when using phone
	$('#events .slide').each(function(){
		var curSlide = $(this).jcarousel({
			list: ".speakers"
		});

		$(this).find(".pagination ul").on('jcarouselpagination:active', 'li', function() {
            $(this).addClass('active');
        }).on('jcarouselpagination:inactive', 'li', function() {
            $(this).removeClass('active');
        })
        .jcarouselPagination({
        	'carousel' : curSlide,
		    'item': function(page, carouselItems) {
		        return '<li><a href="#' + page + '">' + page + '</a></li>';
		    }
		});
	});


	// create sliders, navigation and pagination
	$('.carousel').on('jcarousel:createend', function() {
		var $this = $(this),

		// scroll to last slide
		slideCount = $('#events .slide').length;
        $(this).jcarousel('scroll', slideCount - 1, false);
    }).jcarousel({
    	'item': '.slide'
    }).on('jcarousel:targetin', '.slide', function(event, carousel) {
	    var itemHeight = $(this).outerHeight();
	    $(this).parents('.carousel').css({
	    	"height" : itemHeight
	    });
	});
     
	$('.prev').click(function() {
	    $(this).siblings('.carousel').jcarousel('scroll', '-=1');
	    return false;
	});

	$('.next').click(function() {
	    $(this).siblings('.carousel').jcarousel('scroll', '+=1');
	    return false;
	});


	// initialize map
	var myLatlng = new google.maps.LatLng(56.959081,24.114304);
	var mapOptions = {
    	center: myLatlng,
    	scrollwheel: false,
    	zoom: 14
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

	var marker = new google.maps.Marker({
	    position: myLatlng,
	    map: map,
  		clickable: false,
  		icon: "../img/tooltip.png",
	    title: "Our tmp base!"
	});

	var modal = $('#modal');
	$('#reserve-seat').click(function(e) {
		e.preventDefault();
		modal.addClass("open");
	});
	modal.click(function() {
		modal.removeClass("open");
	});

	$('#join-event').click(function(e) {
		e.preventDefault();

	    var href = $(this).attr("href");
	    $(href).animatescroll();
	});

	$('#goto-map').click(function(e) {
		e.preventDefault();

	    var href = $(this).attr("href");
	    $(href).animatescroll();
	    return false;
	});

	// do parallax for top title
	$(window).scroll(function() {
		easyPeasyParallax();
		if($('body').width() >= 1020) {
			easyPeasyNav();
		}
	});


	// open members
	centerArrow($('#member-nav li:nth-child(2) a')); 
	$('#member-nav a').click(function(e) {
		e.preventDefault();
		centerArrow($(this));    
	});


	// open/close off-canvas
	$('#off-canvas a.open').click(function(e) {
		e.preventDefault();

	    $(this).parent().toggleClass('active');
	});
	$('#off-canvas ul a, .logo a').click(function(e) {
		var $this = $(this);
		if($this.hasClass("network")) return;

	    var href = $(this).attr("href");
	    $(href).animatescroll();

	    if($('body').width() < 1020) {
			$('#off-canvas').removeClass('active');
		}

	    return false;
	});


	// get github staff
	$.getJSON("https://api.github.com/orgs/twitter/members", function(data){
		var newData = "";

		for(user in data) {
			newData += "<li><a href=\"" + data[user].html_url + "\" target=\"_blank\"><img src=\"" + data[user].avatar_url + "\" alt=\"" + data[user].login + "\"></a><div class=\"tip\">" + data[user].login + "</div></li>"
		}
		
		$('#member-list ul.github').append(newData);	
	});
});