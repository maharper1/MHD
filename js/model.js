var proxyUrl = 'proxy/xml2json_proxy.php?';
var zillowKey = 'zws-id=X1-ZWz1esjan1mvbf_23up5';
var zillowDeepSearch = 'http://www.zillow.com/webservice/GetDeepSearchResults.htm?';
var zillowUpdatedDetails = 'http://www.zillow.com/webservice/GetUpdatedPropertyDetails.htm';

function formatDeepSearch(loc, result, zillowBody){
	var soldPrice = new Intl.NumberFormat().format(result.lastSoldPrice);
	var lastSold = '';
	if (result.lastSoldDate)
		lastSold = 'Last Sold: '+ result.lastSoldDate + ' for $' + soldPrice;
	var size = new Intl.NumberFormat().format(result.finishedSqFt);
	var lotSize = new Intl.NumberFormat().format(result.lotSizeSqFt);
	var taxAssess = new Intl.NumberFormat().format(result.taxAssessment);
	var zEst = '';
	if (result.zestimate.amount) {
		var Est = new Intl.NumberFormat().format(result.zestimate.amount);
		zEst = 'Zestimate®: $'+ Est + ' as of ' + result.zestimate["last-updated"];
	}
	var zillowBlock = appendElement(zillowBody, "P", "zillowBlock");
	appendText(zillowBlock, result.useCode);
	appendText(zillowBlock, 'Total Rooms:  ' + result.totalRooms);
	appendText(zillowBlock, 'Bathrooms: '+ result.bathrooms);
	appendText(zillowBlock, 'Bedrooms: '+ result.bedrooms);
	appendText(zillowBlock, 'Size: '+ size + ' square feet');
	appendText(zillowBlock, 'Lot Size: '+ lotSize + ' square feet');
	appendText(zillowBlock, 'Tax Assessment: $' + taxAssess + ' in ' + result.taxAssessmentYear);
	appendText(zillowBlock, lastSold);
	appendText(zillowBlock, zEst);

	var zillowPara = appendElement(zillowBody, "P", "zillowLinkPara");
	zillowPara.appendChild(document.createTextNode('See more details for '));
	var zillowLink = document.createElement("A");
	zillowLink.href = result.links.homedetails;
	zillowLink.target = "_blank";
	zillowLink.innerHTML = loc.Address;
	zillowPara.appendChild(zillowLink);
	zillowPara.appendChild(document.createTextNode(' on Zillow.'));
}

function zillowCall(loc, API, APIParams, zillowBody) {
	var zillowUrl = proxyUrl + API + zillowKey + APIParams;
	var formatFn;
	if (API = zillowDeepSearch) {
		formatFn = formatDeepSearch;
	} else {
	//	formatFn = formatUpdatedDetails;
	}
	var xmlhttp = false;

	var zillowMsg = appendElement(zillowBody, "H5", "zillowMsg");
	appendText(zillowMsg, 'Retrieving Zillow data...');

	var zillowRequestTimeout = setTimeout(function(){
		hideWaitMessage();
		appendText(zillowMsg, 'Request to Zillow Timed Out.');
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
				case 1: appendText(zillowMsg, 'Zillow request opened.'); break;
				case 2: appendText(zillowMsg, 'Waiting for Zillow data.'); break;
				case 3: appendText(zillowMsg, 'Receiving Zillow data.'); break;
				case 4: appendText(zillowMsg, 'Waiting for Zillow data.');
						if (xmlhttp.status==200) {
							var json;
							if (JSON && JSON.parse){
								json = JSON.parse(xmlhttp.responseText);
							} else {
								eval("var json = " + xmlhttp.responseText);
							}
							if (json.message.code==0){
								var result = json.response.results.result;
								if (Array.isArray(result)) {
									result = result[0];
								}
								zillowBody.removeChild(zillowMsg);
								formatFn(loc, result, zillowBody);
							} else {
								appendText(zillowMsg, json.message.text);
							}
							clearTimeout(zillowRequestTimeout);
							hideWaitMessage();
						}
						break;
			}
		}
		showWaitMessage();
		xmlhttp.open("GET", zillowUrl, true);
		xmlhttp.send(null);
		return true;
	} else {
		appendText(zillowMsg, 'Zillow Request Failed.');
		hideWaitMessage();
		return false;
	}
}

function getZillowData(loc, zilCol){
	// Zillow branding
	var zillowHeader = appendElement(zilCol, "DIV", "zillowHeader");
	var zillowImg = appendElement(zillowHeader, "IMG");
	zillowImg.src = "http://www.zillow.com/widgets/GetVersionedResource.htm?path=/static/logos/Zillowlogo_150x40.gif";
	zillowImg.width = 150;
	zillowImg.height = 40;
	zillowImg.alt = "Zillow Real Estate Search";

	var zillowBody = appendElement(zilCol, "DIV", "zillowBody");
	var DeepSearchParams = '&address=' + encodeURIComponent(loc.Address)
	   + '&citystatezip=' + encodeURIComponent('Madison IN 47250');
	zillowCall(loc, zillowDeepSearch, DeepSearchParams, zillowBody);
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
		case "NIP": return "not in period of significance.";
		case "A": return "of alterations.";
		case "DEM": return "demolished.";
		default: return "no reason found.";
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

function formatNHLData(loc, NHLCol){
	var streetviewURL = getStreetView(loc);
	var c;
	if (loc["#C"] != null) {c = loc["#C"]} else {c=0}
	var nc;
	if (loc["#N/C"] != null) {nc = loc["#N/C"]} else {nc=0}
	var rating;
	if (loc["NHL Rating"] === "N/C") {
		rating = "Non-Contributing (" + nc + ")"
	} else {
		rating = "Contributing (" + c + ")"
		if (loc["#N/C"] != null) {
			rating = rating + ", Non-Contributing (" + nc + ")"
		}
	}
	if (loc["#N/C"] != null) {
		rating = rating + " because " + decodeNCReason(loc["N/C Reason"]);
	}
	var dateBuilt = loc["StartDate"];
	if (loc["Approximate"] === "TRUE"){
		dateBuilt = "~" + dateBuilt;
	}
	if (loc["Range"] === "TRUE"){
		dateBuilt = dateBuilt + ' - ' + loc["EndDate"];
	}
	var style = loc["Style"];
	if (loc["SubStyle"] != "None") {
		style = style + ': ' + loc["SubStyle"];
	}

	var NHLNInfo = appendElement(NHLCol, "DIV", "NHLNInfo");
	appendElement(NHLNInfo, "H4", "NHLNTitle", ["text-center"], "Historic Landmark Data*");
	var buildingImgPara = appendElement(NHLNInfo, "P", "buildingImgPara", ["text-center"]);
	var buildingImg = appendElement(buildingImgPara, "IMG");
	buildingImg.src = streetviewURL;
	appendElement(NHLNInfo, "P", "HLDetails");
	appendText(NHLNInfo, "Building Type: "+ loc["Building Type"]);
	appendText(NHLNInfo, "Style: "+ style);
	appendText(NHLNInfo, "Date: "+ dateBuilt);
	appendText(NHLNInfo, "NHL Rating: "+ rating);
	var NHLNFooter = appendElement(NHLCol, "DIV", "NHLNFooter", ["bg-info", "text-center"]);
	var footerLink = appendElement(NHLNFooter, "A", "footerLink", null, "*National Historic Landmark Nomination Documentation");
	footerLink.href = "http://pdfhost.focus.nps.gov/docs/NHLS/Text/73000020.pdf";
	footerLink.target = "_blank";
}

function formatNotes(loc, notesRow){
	if (loc["Notes"].length > 0) {
		var notes = appendElement(notesRow, "P", "notes", [], loc["Notes"]);
		var divider = document.createElement("HR");
		notesRow.insertBefore(divider, notes);
	}
}

function appendText(newParent, newContent){
	if (newContent) {
		var newText = document.createTextNode(newContent);
		newParent.appendChild(newText);
		newParent.appendChild(document.createElement("BR"));
	}
}

function appendElement(newParent, newType, newId, newClasses, newContent){
	var newElement = document.createElement(newType);
	if(newId) newElement.id = newId;
	if (newClasses) {
		for (var newClass in newClasses) {
			newElement.classList.add(newClasses[newClass]);
		}
	}
	if (newParent) {
		newParent.appendChild(newElement);
	}
	appendText(newElement, newContent);
	return newElement;
}

function formatHeading(loc, headRow){
	if (loc["Historic Name of Resource"].length > 0){
		var headingName = appendElement(headRow, "H3", "headingName", [], loc["Historic Name of Resource"]);
	}
	var headingAddress = appendElement(headRow, "H4", "headingAddress", [], loc["Address"]);
}

function displayInfoWindow(loc, iw){
    infowindow.setContent(iw);
    infowindow.open(map, loc._mapMarker);
}

function showDetails(loc) {
	var iw = appendElement(null, "DIV", "infowindow", ["container-fluid"]);
	var headRow = appendElement(iw, "DIV", "headRow", ["row"]);
	var bodyRow = appendElement(iw, "DIV", "bodyRow", ["row"]);
	var NHLCol = appendElement(bodyRow, "DIV", "NHLData", ["col-xs-12", "col-sm-6"]);
	var zilCol = appendElement(bodyRow, "DIV", "zillowData", ["col-xs-12", "col-sm-6"]);
	var notesRow = appendElement(iw, "DIV", "notesRow", ["row"]);

	formatHeading(loc, headRow);
	formatNotes(loc, notesRow);
	formatNHLData(loc, NHLCol);

	// var zillowData = 'Retrieving Zillow Data';
	displayInfoWindow(loc, iw);
    getZillowData(loc, zilCol);
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
	if (changeInZoom === 0) return;
	var mouseZoomIssue = false;

	for (i=0; i < locations.length; i++){
		curIcon = locations[i]._mapMarker.getIcon();
		if (curIcon.size) {
			locations[i]._mapMarker.setIcon({
				url: curIcon.url,
				scaledSize: new google.maps.Size(
					curIcon.size.width * Math.pow(2,changeInZoom),
					curIcon.size.height * Math.pow(2,changeInZoom))
			});
		} else {
			mouseZoomIssue = true;
		}
		if (mouseZoomIssue){
			alert('Please use the zoom control, or zoom one click at a time with the mouse wheel. You may need to reload the page to reset the icon sizes.');
			break;
		}
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
	self.searchRating = ko.observableArray(["C","N/C"]);
	self.searchStyle = ko.observable("All");
	self.searchDate = ko.observable(2020);
    self.filteredLocs = ko.computed(function(){
		return ko.utils.arrayFilter(self.locations(), function(loc) {
			var found =
        		(self.searchNo().length == 0 || ko.utils.stringStartsWith(loc["Street Number"], self.searchNo()))
        		&& (self.searchDirs().indexOf(loc["Street Direction"]) > -1 )
        		&& (self.searchSt() == 'All' || self.searchSt() == loc["Street"])
        		&& (self.searchRating().indexOf(loc["NHL Rating"]) > -1 )
        		&& (self.searchStyle() == 'All' || self.searchStyle() == loc["Style"])
        		&& (loc["EndDate"] <= self.searchDate());
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
	self.filteredCount = ko.computed(function(){
		return self.filteredLocs().length;
	})
}

ko.applyBindings(new mapViewModel);
