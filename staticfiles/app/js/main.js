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

$(document).ready(function(){

	var map;
	var service;
	var markers = {};
	var user_history_ids = [];

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
				service = new google.maps.places.PlacesService(map);
				searchPlaces();
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

	function showMarkers(showmarkers){
		for (var i in showmarkers){
			showmarkers[i].setMap(map);
		}
	}

	function hideMarkers(hidemarkers){
		for (var i in hidemarkers){
			hidemarkers[i].setMap(null);
		}
	}

	function deleteMarkers(deletemarkers){
		for (var i in deletemarkers){
			var marker = deletemarkers[i];
			marker = null;
		}
	}

	function clearMarkers(clearmarkers){
		hideMarkers(clearmarkers);
		deleteMarkers(clearmarkers);
	}

	function searchPlaces(){
		var newLocation = map.getCenter();
		var request = {
			location: newLocation,
			radius: '500',
			types: ['restaurant', 'bakery', 'bar', 'cafe', 'food', 'meal_delivery', 'meal_takeaway'],
		}
		service.nearbySearch(request, callback);
	}

	function callback(results, status){
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				var place_id = results[i].id;
				if (!markers.hasOwnProperty(place_id) && user_history_ids.indexOf(place_id) == -1){
					var place = results[i]; 
					setMarker(place, map);
					continue;
				}
			}
		}
	}

	function setMarker(place, mapset){
		var LatLng = new google.maps.LatLng(place.geometry.location.d, place.geometry.location.e);
		var name = place.name;
		var address = place.vicinity;
		var place_id = place.id;
		var marker = new google.maps.Marker({
			position: LatLng,
			map: mapset,
			icon: place.icon,
			clicked: false,
			place_id : place_id,
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

		google.maps.event.addListener(infowindow, 'domready', function(){
			$(".place_button").on("click", function(event){
				$.ajax({
					method : "GET",
					url : "/add_user_place/",
					data : {
						"id" : marker.place_id,
						"name" : name,
						"address" : address,
					},
					success : function(result){
						test = marker;
						infowindow.close();
						marker.clicked = false;
						if (result.place_status == "exists"){
							return;
						} else if (result.place_status == "created") {
							var list = $(".popup[div='div1'] ul")[0];
							var li = document.createElement("li");
							li.innerHTML = name;
							list.appendChild(li);
							user_history_ids.push(marker.place_id);
						}
						console.log("Place has been logged succesfully! ");
						marker.setMap(null);
						marker = null;
					},
					error : function(error){
						console.log("AJAX ERROR");
					},
				});
			});
		});
		if (!markers.hasOwnProperty(place_id)){
			markers[place_id] = marker;	
		} else {
			marker.setMap(null);
			delete marker;
		}
		
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

	$("#logout").click(function(event){
		$.ajax({
			method : "GET",
			url : "/logout/",
			success : function(result){
				if (result.status == "success"){
					window.location.href = "/";
				}
			}
		})
	});

	$.ajax({
		method : "GET",
		url : "/get_user_info/",
		success : function(result){
			$("#greeting").html("Welcome, " + result.user);
			$("#greeting").css({"color" : "white"});
			var list = $(".popup[div='div1'] ul")[0];
			for (var i in result.history){
				var li = document.createElement("li");
				li.innerHTML = result.history[i].name;
				list.appendChild(li);
				user_history_ids.push(result.history[i].id);
			}
		}
	});

	initialize();

});
