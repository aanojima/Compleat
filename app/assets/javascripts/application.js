// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
var map;
var service;

	function handleNoGeolocation(errorFlag) {
		var initialLocation;
		if (errorFlag == true) {
			alert("Geolocation service failed.");
			initialLocation = new google.maps.LatLng(90, 180);
		} else {
			alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
			initialLocation = new google.maps.LatLng(-90, 0);
		}
		map.setCenter(initialLocation);
	}

	function initialize() {
		// TESTING
		var initialLocation;
		if(navigator.geolocation) {
			browserSupportFlag = true;
			navigator.geolocation.getCurrentPosition(function(position) {
				initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				map.setCenter(initialLocation);
				var request = {
					location: initialLocation,
					radius: '225',
					types: ['restaurant']
				}
				service = new google.maps.places.PlacesService(map);
				service.nearbySearch(request, callback);
			}, function() {
				handleNoGeolocation(browserSupportFlag);
			});
		}
		// Browser doesn't support Geolocation
		else {
			browserSupportFlag = false;
			handleNoGeolocation(browserSupportFlag);
		}
		//
		var mapOptions = {
			zoom: 17,
		};

		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	}

	function callback(results, status){
	    if (status == google.maps.places.PlacesServiceStatus.OK) {
	      for (var i = 0; i < results.length; i++) {
	        var place = results[i];
	        // console.log(place);
	        setMarker(place, map);
	        // console.log(place.name);
	        // console.log(place.geometry.location.d);
	        // console.log(place.geometry.location.e);
	        // console.log(place.geometry.location.d + place.geometry.location.e);
	      }
	   }
	}
	function setMarker(place, mapset){
		var LatLng = new google.maps.LatLng(place.geometry.location.d, place.geometry.location.e);
		var name = place.name;
		var address = place.formatted_address;
		var marker = new google.maps.Marker({
			position: LatLng,
			map: mapset
		});
		var rating = place.rating;
		if (rating){
			rating = rating.toString();
		}
		else{
			rating = 'No rating available';
		}
		var contentString = '<div>'+
		'<div>'+
		'</div>'+
		'<h2 class="restaurantName">' + name + '</h2>' +
		'<p>Rating: ' + rating + '<br/>' +
		'Address: ' + address + '</p>';
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		google.maps.event.addListener(marker, 'click', function(){
			infowindow.open(map, marker);
		});
		marker.setMap(mapset);
	}
	// $(window).on('load' initialize);
	// google.maps.event.addDomListener(window, 'load', initialize);
	$(document).ready(initialize);

// });