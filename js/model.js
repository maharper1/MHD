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

function showDetails(loc) {
	var style = loc["Style"];
	var dateBuilt = loc["StartDate"];
	var heading = loc["Address"];
	var c, nc, notes, rating;
	if (loc["Historic Name of Resource"].length > 0){
		heading = '<h4>' + loc["Historic Name of Resource"] + '</h4><br>' + heading;
	}
	if (loc["#C"] != null) {c = loc["#C"]} else {c=0}
	if (loc["#N/C"] != null) {nc = loc["#N/C"]} else {nc=0}
	if (loc["NHL Rating"] === "N/C") {
		rating = "<b>Non-Contributing</b> (" + nc + ")"
	} else {
		rating = "<b>Contributing</b> (" + c + ")"
		if (loc["#N/C"] != null) {
			rating = rating + ", Non-Contributing (" + nc + ")"
		}
	}
	if (loc["Approximate"] === "TRUE"){
		dateBuilt = "~" + dateBuilt;
	}
	if (loc["Range"] === "TRUE"){
		dateBuilt = dateBuilt + ' - ' + loc["EndDate"];
	}
	if (loc["SubStyle"] != "None") {
		style = style + ': ' + loc["SubStyle"];
	}
	if (loc["Notes"].length > 0) {
		notes = '<hr><p>'+ loc["Notes"] + '</p>';
	} else {
		notes = '';
	}
	var content =
		'<div id="infowindow" class="panel panel-info">' +
		'<div class="panel-heading">'+ heading +'</div>' +
        '<div class="panel-body">'+
        'Building Type: '+ loc["Building Type"] +
        '<br>Style: '+ style +
        '<br>Date: '+ dateBuilt +
        '<br>NHL Rating: '+ rating +
        notes +
    	'</div>';
    infowindow.setContent(content);
    infowindow.open(map, loc._mapMarker);
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
    loc._mapMarker = marker;

    google.maps.event.addListener(marker, 'click', function() {return showDetails(loc)});
}

function resizeIcons(locations) {
	var zoom = map.getZoom();
	var changeInZoom = zoom - last_zoom;

	for (i=0; i < locations.length; i++){
		curIcon = locations[i]._mapMarker.getIcon();
		locations[i]._mapMarker.setIcon({
			url: curIcon.url,
			scaledSize: new google.maps.Size(
				curIcon.size.width * Math.pow(2,changeInZoom),
				curIcon.size.height * Math.pow(2,changeInZoom))
		});
	}
	last_zoom = zoom;
}

function centerMarker(loc){
	map.setCenter(new google.maps.LatLng(loc.latitude, loc.longitude));
	map.setZoom(18);
	showDetails(loc);
}

ko.bindingHandlers.googlemap = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor();
        var mapOptions = {
            zoom: value.zoom,
            center: new google.maps.LatLng(value.centerLat, value.centerLon),
            mapTypeId: google.maps.MapTypeId.TERRAIN
            }
        map = new google.maps.Map(element, mapOptions);

        var locations = viewModel.locations(); //value.filteredLocs();
        infowindow = new google.maps.InfoWindow();
        for (var loc in locations) {
            addMarker(locations[loc]);
        }
        last_zoom = value.zoom;
        google.maps.event.addListener(map, 'zoom_changed', function(){resizeIcons(locations)});
    }
};

ko.utils.stringStartsWith = function(string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length) return false;
    return string.substring(0, startsWith.length) === startsWith;
};

var mapViewModel = function() {
	var self = this;
    self.locations = ko.observableArray(markerData);
    self.centerOnLoc = function(loc){centerMarker(loc);};
	self.searchNo = ko.observable('');
	self.searchSt = ko.observable('All');
	self.searchDirs = ko.observableArray(["East","West",""]);
    self.filteredLocs = ko.computed(function(){
    	//for (var loc in self.locations) {loc._visible = false;}
		return ko.utils.arrayFilter(self.locations(), function(loc) {
			var found =
        		(self.searchNo().length == 0 || ko.utils.stringStartsWith(loc["Street Number"], self.searchNo()))
        		&& (self.searchDirs().indexOf(loc["Street Direction"]) > -1 )
        		&& (self.searchSt() == 'All' || self.searchSt() == loc["Street"]);
        	if (typeof loc._mapMarker != 'undefined'){
        		if (found) {
        			loc._mapMarker.setVisible(true);
        		} else {
        			loc._mapMarker.setVisible(false);
        		}
        	}
        	return found;
		});
	})
}

ko.applyBindings(new mapViewModel);
