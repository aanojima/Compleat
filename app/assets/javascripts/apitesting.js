var map;
var service;


function initialize() {
	var boston = new google.maps.LatLng(42.3581, -71.0636);
	var mapOptions = {
		zoom: 17,
		center: boston
	};

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	var request = {
		location: boston,
		radius: '225',
		types: ['restaurant']
	}

	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, callback);

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
google.maps.event.addDomListener(window, 'load', initialize);


