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
var placemarkers;

$(document).ready(function(){

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
		var initialLocation;
		if(navigator.geolocation) {
			browserSupportFlag = true;
			navigator.geolocation.getCurrentPosition(function(position) {
				initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				map.setCenter(initialLocation);
				var request = {
					location: initialLocation,
					radius: '1000',
					types: ['restaurant', 'cafe', 'bar', 'food', 'meal_delivery', 'meal_takeaway'],
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
		
		var mapOptions = {
			zoom: 17,
		};

		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		google.maps.event.addListener(map, 'dragend', function(event){
			searchPlaces();
		});

	}

	function callback(results, status){
		// console.log(results);
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
		var address = place.vicinity;
		var marker = new google.maps.Marker({
			position: LatLng,
			map: mapset,
			icon: place.icon,
			clicked: false
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
		'Address: ' + address + '</p>' +
		'</div>'+
		'<button class="place_button" name="' + name + '"" type="button">Been here</button>';

		google.maps.event.addListener(marker, 'click', function(){
			marker.clicked = true;
		});
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		google.maps.event.addListener(infowindow, 'closeclick', function(){
			marker.clicked = false;
		});
		var hoverListener = new google.maps.event.addListener(marker, 'mouseover', function(){
			infowindow.open(map, marker);
		});
		var mouseOutListener = new google.maps.event.addListener(marker,'mouseout',function(){
			if (!marker.clicked){
				infowindow.close(map, marker);
			}
		});

		marker.setMap(mapset);
	}

	function searchPlaces(){
		var newLocation = map.getCenter();
		var request = {
			location: newLocation,
			radius: '1000',
			types: ['restaurant']
		}
		service.nearbySearch(request, callback); 
	}
	
	$(".menu_selector").on("click", function(event){
		var menu = $(this).attr("id");
		var query = ".popup[div='" + menu + "']";
		var width = $(query).width();
		$(".popup").animate({"width" : "0px"});
		var css;
		width == 300 ? css = "0px" : css = "300px";
		$(query).animate({"width" : css});
	});	

	initialize();

});
