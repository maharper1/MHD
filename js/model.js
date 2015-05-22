function getIconIndex(addressStyle){
	switch (addressStyle) {
	  case "Federal": return 0;
	  case "Italianate": return 1;
	  case "Vernacular: Shotgun": return 2;
	  case "Art Deco": return 3;
	  case "Barn": return 4;
	  case "Bridge": return 5;
	  case "Bungalow/Craftsman/Foursquare": return 6;
	  case "Classical/Greek Revival": return 7;
	  case "Colonial Revival": return 8;
	  case "Commercial Style": return 9;
	  case "Designed Landscape": return 10;
	  case "Functional": return 11;
	  case "Gothic Revival": return 12;
	  case "Modern Movement": return 13;
	  case "None": return 14;
	  case "Other": return 15;
	  case "Prairie School": return 16;
	  case "Renaissance Revival": return 17;
	  case "Tudor Revival": return 18;
	  case "Victorian": return 19;
	  case "Vernacular Landscape": return 20;
	  case "Vernacular: Gable Front": return 21;
	  case "Vernacular: Other": return 22;
	  default: return 2;
	}
}

function redrawMap(){
	google.maps.event.trigger(map, "resize");
}

function addMarker(loc) {
	var img = markerIconData[getIconIndex(loc.Style)];
	var initSize = 0.03;
  	var markerIcon = {
  		url: img.url,
  		size: new google.maps.Size(img.width * initSize, img.height * initSize),
  		scaledSize: new google.maps.Size(img.width * initSize, img.height * initSize)
  	};
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(loc.latitude, loc.longitude),
      map: map,
      title: loc.Address,
      icon: markerIcon
    });

    google.maps.event.addListener(marker, 'click', (function(marker) {
    	return function() {
	        infowindow.setContent(loc.Address);
	        infowindow.open(map, marker);
    	}
    })(marker));

    markers.push(marker);
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
	last_zoom = zoom;
}

function centerMarker(loc){
	map.setCenter(google.maps.LatLng(loc.latitude, loc.longitude));
}

ko.bindingHandlers.googlemap = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        var mapOptions = {
            zoom: value.zoom,
            center: new google.maps.LatLng(value.centerLat, value.centerLon),
            mapTypeId: google.maps.MapTypeId.TERRAIN
            }
        map = new google.maps.Map(element, mapOptions);

        markers = [];
        infowindow = new google.maps.InfoWindow();
        for (var loc in value.locations()) {
            addMarker(value.locations()[loc]);
        }
        last_zoom = value.zoom;
        google.maps.event.addListener(map, 'zoom_changed', resizeIcons);
    }
};

function mapViewModel()  {
	var self =  this;
    self.locations = ko.observableArray(markerData);
    self.centerOnLoc = function(loc){
    	centerMarker(loc);
    }
}

ko.applyBindings(new mapViewModel());
