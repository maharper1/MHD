
var map;
var markers = [];
var infowindow = new google.maps.InfoWindow();
function getIconImage(addressStyle){
	switch (addressStyle) {
	  case "Federal": return {url: 'images/Federal.png', height: 138, width: 96};
	  case "Italianate": return {url: 'images/Italianate.png', height: 138, width: 96};
	  case "Vernacular: Shotgun": return {url: 'images/Shotgun.png', height: 89, width: 89};
	  case "Art Deco":
	  case "Barn":
	  case "Bridge":
	  case "Bungalow/Craftsman/Foursquare":
	  case "Classical/Greek Revival":
	  case "Colonial Revival":
	  case "Commercial Style":
	  case "Designed Landscape":
	  case "Functional":
	  case "Gothic Revival":
	  case "Modern Movement":
	  case "None":
	  case "Other":
	  case "Prairie School":
	  case "Renaissance Revival":
	  case "Tudor Revival":
	  case "Victorian":
	  case "Vernacular Landscape":
	  case "Vernacular: Gable Front":
	  case "Vernacular: Other":
	  default: return {url: 'images/Shotgun.png', height: 89, width: 89};
	}
}

var last_zoom = 15;

function initialize() {
	var mapOptions = {
      center: { lat: 38.735653, lng: -85.38157},
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    for (i=0; i<data.length; i++){
    	addMarker(data[i]);
    }
    showMarkers();
    google.maps.event.addListener(map, 'zoom_changed', resizeIcons);
}

function addMarker(data) {
	var img = getIconImage(data.Style);
	var zoom = map.getZoom();
	var initSize = 0.05;
  	var markerIcon = {
  		url: img.url,
  		size: new google.maps.Size(img.width * initSize, img.height * initSize),
  		scaledSize: new google.maps.Size(img.width * initSize, img.height * initSize)
  	};
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.latitude, data.longitude),
      map: map,
      title: data.Address,
      icon: markerIcon
    });

    google.maps.event.addListener(marker, 'click', (function(marker) {
    	return function() {
	        infowindow.setContent(data.Address);
	        infowindow.open(map, marker);
    	}
    })(marker));

    markers.push(marker);
}
  // Sets the map on all markers in the array.
function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setAllMap(map);
}

function resizeIcons() {
	var zoom = map.getZoom();
	var changeInZoom = zoom - last_zoom;

	for (i=0; i < markers.length; i++){
		curIcon = markers[i].getIcon();
		markers[i].setIcon({
			url: curIcon.url,
			scaledSize: new google.maps.Size(
				curIcon.size.width * Math.pow(2,changeInZoom),
				curIcon.size.height * Math.pow(2,changeInZoom))
		});
	}

    // _.each(map_shapes, function(s) {

    //     if (! $.isFunction(s.shape.getPosition)) return;

    //     var w = s.shape.getIcon().size.width;
    //     var h = s.shape.getIcon().size.height;

    //     s.shape.setIcon(new google.maps.MarkerImage(
    //         s.shape.getIcon().url, null, null, null, new google.maps.Size(
    //             w - Math.round(w / 3 * (last_zoom - zoom)),
    //             h - Math.round(h / 3 * (last_zoom - zoom)))
    //         )
    //     );
    // });

	last_zoom = zoom;
}



google.maps.event.addDomListener(window, 'load', initialize);
