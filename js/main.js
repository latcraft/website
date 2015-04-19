var easyPeasyParallax = function () {
	var scrollPos = $(this).scrollTop();

	$('#header .info').css({		
		'-webkit-transform': 'translate3d(0px, ' + (scrollPos) + 'px, 0px)',
		'-ms-transform': 'translate3d(0px, ' + (scrollPos) + 'px, 0px)',
		'transform': 'translate3d(0px, ' + (scrollPos) + 'px, 0px)',
		'opacity': 1-(scrollPos/250)
	});
}

var removeTransform = function (item) {
	item.css({		
		'-webkit-transform': 'translate3d(0px, 0px, 0px)',
		'-ms-transform': 'translate3d(0px, 0px, 0px)',
		'transform': 'translate3d(0px, 0px, 0px)'
	});
}

var easyPeasyNav = function () {
	var scrollPos = $(this).scrollTop();
	var header = $('#header');
	var offCanvas = $('#off-canvas');

	if(scrollPos >= header.height() + 1) {
		offCanvas.addClass('visible');
	} else {
		offCanvas.removeClass('visible');
	}
}

var centerModal = function () {
	var modal = $('#modal .holder');

	modal.css({
		'margin-top': -(modal.height()/2) +'px'
	});
}

var centerArrow = function (elem) {
	var containerWidth = $('#about .container').width();

	$('#member-nav a').removeClass('active');
	elem.addClass('active');

	$('#member-list ul').removeClass('active');
	$('#member-list ul').eq(parseInt(elem.parent().index()) - 1).addClass('active');

	var itemWidth = elem.width() / 2;
	var thisPos = elem.position();
}

$(document).ready(function() {
	// center modal window 
	$(window).resize(function() {
		centerModal();
	});


	// do parallax for top title
	$(window).scroll(function() {
		if($(window).width() >= 690) easyPeasyParallax();
		easyPeasyNav();
	});

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


	// digest subscription
	$('#subscription form').submit(function(e) {
		e.preventDefault();
		var email = $('#subscription input[name=email]').val();
  		var subscribers = new Firebase('https://radiant-fire-3288.firebaseio.com/subscribers');
		
		var subForm = $('#subscription'),
			subError = subForm.find('.error'),
			subSuccess = subForm.find('.success');

		subscribers.push(email, function(error) {
		  if (error) {
			subError.addClass('active');
			subSuccess.removeClass('active');				
		  } else {
			subError.removeClass('active');			
			subSuccess.addClass('active');			
		  }
		});
		
	});
	$('#subscription a').click(function() {
	    $(this).parents('.success, .error').removeClass('active');
	});

	// open close reserve seat
	var modal = $('#modal');
	$('#reserve-seat').click(function(e) {
		e.preventDefault();
		modal.addClass("open");
		centerModal();
	});
	modal.click(function() {
		modal.removeClass("open");
	});


	// open/close off-canvas
	$('#off-canvas a.open').click(function(e) {
		e.preventDefault();

	    $(this).parent().toggleClass('active');
	});
	$('#off-canvas ul a, .logo a, .scroll-button').click(function(e) {
		var $this = $(this);
		if($this.hasClass('network')) return;

	    var href = $(this).attr('href');

	    if(href === "#events") {
	    	$(href).animatescroll();
	    } else {
	    	$(href).animatescroll({padding: 100});
	    }	    

	    return false;
	});


	// google map
	var overlay;
	function initialize() {
	    var myLatLng = new google.maps.LatLng(56.959081,24.114304);
	    var mapOptions = {
	        zoom: 15,
	        center: myLatLng,
	        mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
			scrollwheel: false,
		    clickable: false,
		    draggable: false,
		    styles: [{"featureType":"all","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":"20"},{"gamma":"1.04"},{"saturation":"0"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"},{"lightness":"-64"},{"saturation":"-100"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":"17"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"weight":"2.12"},{"visibility":"on"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":"18"},{"visibility":"on"},{"weight":"2.17"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"visibility":"off"},{"lightness":"-32"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#282529"},{"saturation":"-49"},{"lightness":"-9"}]}]
	    };
	    
	    var gmap = new google.maps.Map(document.getElementById('map'), mapOptions);
	    
	    function HTMLMarker(lat,lng){
	        this.lat = lat;
	        this.lng = lng;
	        this.pos = new google.maps.LatLng(lat,lng);
	    }
	    
	    HTMLMarker.prototype = new google.maps.OverlayView();
	    HTMLMarker.prototype.onRemove= function(){}
	    
	    //init your html element here
	    HTMLMarker.prototype.onAdd= function(){
	        div = document.createElement('DIV');
	        div.className = 'maptip';
	        div.innerHTML = 'our event venue';
	        var panes = this.getPanes();
	        panes.overlayImage.appendChild(div);
	    }
	    
	    HTMLMarker.prototype.draw = function(){
	        var overlayProjection = this.getProjection();
	        var position = overlayProjection.fromLatLngToDivPixel(this.pos);
	        var panes = this.getPanes();
	        panes.overlayImage.style.left = position.x + 'px';
	        panes.overlayImage.style.top = position.y - 30 + 'px';
	    }
	    
	    //to use it
	    var htmlMarker = new HTMLMarker(56.9423093,24.1151814); // usually 56.959081, 24.114304
	    htmlMarker.setMap(gmap);
	}

	google.maps.event.addDomListener(window, 'load', initialize);
});