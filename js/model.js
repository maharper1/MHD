
var zillowAPIUrl = 'proxy/xmlproxy.php?'
    + 'http://www.zillow.com/webservice/GetDeepSearchResults.htm?'
	+ 'zws-id=X1-ZWz1esjan1mvbf_23up5';

function getZillowData(loc, header, NHLData){
	var zillowHeader = '<div id="zillowData" class="panel panel-info">'
		+ '<div class="panel-heading">Zillow Data</div>'
		+ '<div class="panel-body">';
	var zillowFooter = '</div>'
		+ '<div class="panel-footer">'
		+ '<img src="http://www.zillow.com/widgets/GetVersionedResource.htm?path=/static/logos/Zillowlogo_150x40_rounded.gif" width="150" height="40" alt="Zillow Real Estate Search" />'
		+ '</div>';
	function formatZillowInfo(result){
		console.log(result);
		var lastSold = '';
		if (result.lastSoldDate) lastSold = 'Last Sold: '+ result.lastSoldDate + ' for ' + result.lastSoldPrice + ' SqFt<br>';
		formattedResult = result.useCode + '<br>'
			+ 'Total Rooms:  ' + result.totalRooms + '<br>'
			+ 'Bathrooms: '+ result.bathrooms + '<br>'
			+ 'Bedrooms: '+ result.bedrooms + '<br>'
			+ 'Size: '+ result.finishedSqFt + ' SqFt<br>'
			+ lastSold
			+ '<br>See more details for <a href="' + result.links.homedetails + '" target="_blank">'
			+  loc.Address +  '</a> on Zillow';
		return formattedResult;
	}
	function displayZillowInfo(content){
		displayInfoWindow(loc, header, NHLData, zillowHeader+content+zillowFooter);
	}

	var zillowUrl = zillowAPIUrl
	   + '&address=' + encodeURIComponent(loc.Address)
	   + '&citystatezip=' + encodeURIComponent('Madison IN 47250');
	var xmlhttp = false;
	displayZillowInfo('Retrieving Zillow Data');
	var zillowRequestTimeout = setTimeout(function(){
		hideWaitMessage();
        displayZillowInfo('Request to Zillow Timed Out.');
    }, 8000);

    if (window.XMLHttpRequest) {
     	try {
			 xmlhttp = new XMLHttpRequest();
     	} catch(err) {
    		xmlhttp = false;
    	}
    } else if(window.ActiveXObject){
    	try {
    		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    	} catch(err) {
    		try {
    			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    		} catch(err) {
    			xmlhttp = false;
    		}
    	}
    }

	if (xmlhttp) {
		xmlhttp.onreadystatechange = function(){
			switch (xmlhttp.readyState){
				case 1: displayZillowInfo('Zillow request opened.'); break;
				case 2: displayZillowInfo('Waiting for Zillow data.'); break;
				case 3: displayZillowInfo('Receiving Zillow data.'); break;
				case 4: displayZillowInfo('Waiting for Zillow data.');
						if (xmlhttp.status==200) {
							var json;
							if (JSON && JSON.parse){
								json = JSON.parse(xmlhttp.responseText);
							} else {
								eval("var json = " + xmlhttp.responseText);
							}
							if (json.message.code==0){
								var result = json.response.results.result;
								displayZillowInfo(formatZillowInfo(result));
							} else {
								displayZillowInfo(json.message.text);
							}
							clearTimeout(zillowRequestTimeout);
							hideWaitMessage();
						}
						break;
			}
		}
		showWaitMessage();
		xmlhttp.open("GET",zillowUrl,true);
		xmlhttp.send(null);
		return true;
	} else {
		displayZillowInfo('Zillow Request Failed.');
		hideWaitMessage();
		return false;
	}
}

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

function decodeNCReason(reason){
	switch (reason) {
		case "NIP": return "not in period of significance";
		case "A": return "of alterations";
		case "DEM": return "demolished";
		default: return "no reason found";
	}
}

function redrawMap(){
	google.maps.event.trigger(map, "resize");
}

function getStreetView(loc){
	var bearing = google.maps.geometry.spherical.computeHeading(
		new google.maps.LatLng(loc["streetGeo"].latitude, loc["streetGeo"].longitude),
		new google.maps.LatLng(loc["latitude"], loc["longitude"]));
	return 'http://maps.googleapis.com/maps/api/streetview?'+
	      'size=200x200&location=' + loc["streetGeo"].latitude+','+loc["streetGeo"].longitude +
	      '&heading='+bearing+'&fov=60&pitch=10';
}

function formatHeading(loc){
	var heading = '<h4>' + loc["Address"] + '</h4>';
	if (loc["Historic Name of Resource"].length > 0){
		heading = '<h3>' + loc["Historic Name of Resource"] + '</h3>' + heading;
	}
	return heading;
}

function formatNHLData(loc){
	var streetviewURL = getStreetView(loc);
	var style = loc["Style"];
	var dateBuilt = loc["StartDate"];
	var streetLoc = loc["streetGeo"].latitude + ', ' + loc["streetGeo"].longitude;
	var c, nc, notes, rating;

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
	if (loc["#N/C"] != null) {
		rating = rating + " because " + decodeNCReason(loc["N/C Reason"]);
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
	return '<div id="NHLNInfo">'
		+ '<div><img src="' + streetviewURL + '"></div>'
		+ '<div><h4>Landmark Information</h4></div>'
		+ '<div>'
		+ 'Building Type: '+ loc["Building Type"]
		+ '<br>Style: '+ style
		+ '<br>Date: '+ dateBuilt
		+ '<br>NHL Rating: '+ rating
		+ notes + '</div>'
		+ '<div class="bg-info">'
		+ '<a href="http://pdfhost.focus.nps.gov/docs/NHLS/Text/73000020.pdf" target="_blank">National Historic Landmark Nomination Documentation</a>'
		+ '</div>';
}

function displayInfoWindow(loc, header, NHLData, zillowData){
	var content = '<div id="infowindow" class="container-fluid">'
		+ '<div class="row">'
		+ header
		+ '</div>'
		+ '<div class="row">'
		+ '<div id="NHLData" class="col-xs-12 col-sm-6"'
		+ NHLData
		+ '</div>'
		+ '<div id="zillowData" class="col-xs-12 col-sm-6"'
		+  zillowData
		+ '</div>'
		+ '</div></div>';
    infowindow.setContent(content);
    infowindow.open(map, loc._mapMarker);
}

function showDetails(loc) {
	var header = formatHeading(loc);
	var NHLData = formatNHLData(loc);
	var zillowData = 'Retrieving Zillow Data';
	displayInfoWindow(loc, header, NHLData, zillowData);
    getZillowData(loc, header, NHLData);
}

function addMarker(loc) {
	var img = markerIconData[getIconIndex(loc.Style)];
	var initSize = 0.015;
  	var markerIcon = {
  		url: img.url,
  		size: new google.maps.Size(img.width * initSize, img.height * initSize),
  		scaledSize: new google.maps.Size(img.width * initSize, img.height * initSize)
  	};
  	var streetLoc = new google.maps.LatLng(loc.streetGeo.latitude, loc.streetGeo.longitude);
  	var locCenter = new google.maps.LatLng(loc.latitude, loc.longitude);
  	var heading = google.maps.geometry.spherical.computeHeading(streetLoc,locCenter);
    var marker = new google.maps.Marker({
    	position: new google.maps.geometry.spherical.computeOffset(streetLoc, 7, heading),
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

ko.utils.stringStartsWith = function(string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length) return false;
    return string.substring(0, startsWith.length) === startsWith;
};

ko.bindingHandlers.googlemap = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor();
        var mapOptions = {
            zoom: value.zoom,
            center: new google.maps.LatLng(value.centerLat, value.centerLon),
            mapTypeId: google.maps.MapTypeId.TERRAIN
            }
        map = new google.maps.Map(element, mapOptions);
        var locations = viewModel.locations();
        infowindow = new google.maps.InfoWindow();
        for (var loc in locations) {
            addMarker(locations[loc]);
        }
        last_zoom = value.zoom;
        google.maps.event.addListener(map, 'zoom_changed', function(){resizeIcons(locations)});
    }
};

var mapViewModel = function() {
	var self = this;
    self.locations = ko.observableArray(markerData);
    self.centerOnLoc = function(loc){centerMarker(loc);};
	self.searchNo = ko.observable('');
	self.searchSt = ko.observable('All');
	self.searchDirs = ko.observableArray(["East","West",""]);
    self.filteredLocs = ko.computed(function(){
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
