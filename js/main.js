var easyPeasyParallax = function () {
	scrollPos = $(this).scrollTop();

	$('#header .info').css({
		'margin-top': (scrollPos)+"px",
		'opacity': 1-(scrollPos/250)
	});
}

var easyPeasyNav = function () {
	scrollPos = $(this).scrollTop();
	var header = $('#header');
	var offCanvas = $('#off-canvas');

	if(scrollPos >= header.height()) {
		offCanvas.addClass("active");
	} else {
		offCanvas.removeClass("active");
	}
}

var centerArrow = function (elem) {
	var containerWidth = $("#about .container").width();

	$('#member-nav a').removeClass("active");
	elem.addClass("active");

	$('#member-list ul').removeClass("active");
	$('#member-list ul').eq(parseInt(elem.parent().index()) - 1).addClass("active");

	var itemWidth = elem.width() / 2;
	var thisPos = elem.position();

	$('#member-nav .arrow').css({
		"left" : ((thisPos.left + itemWidth - 5)/containerWidth) * 100 + "%"
	});	 
}

$(document).ready(function($) {
	// fetch one tweet
	var tweetConfig = {
		"id": '558200865941909504',
		"domId": 'twitter-feed',
		"maxTweets": 3,
		"enableLinks": true
	};
	twitterFetcher.fetch(tweetConfig);


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


	// enable sliders, navigation and pagination
	$('.carousel').jcarousel();

	$('#news-slider .pagination ul')
        .on('jcarouselpagination:active', 'li', function() {
            $(this).addClass('active');
        })
        .on('jcarouselpagination:inactive', 'li', function() {
            $(this).removeClass('active');
        })
        .jcarouselPagination({
		    'item': function(page, carouselItems) {
		        return '<li><a href="#' + page + '">' + page + '</a></li>';
		    }
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


	// open/close modal window for Eventbrite
	var modal = $('#modal');
	$('#get-ticket').click(function() {
		modal.addClass("open");
	});
	modal.click(function() {
		modal.removeClass("open");
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