// PHP Proxy
var proxyUrl = 'proxy/xml2json_proxy.php?';

// My Zillow key
var zillowKey = 'zws-id=X1-ZWz1esjan1mvbf_23up5';

// URL to Zillow Deep Search function
var zillowDeepSearch = 'http://www.zillow.com/webservice/GetDeepSearchResults.htm?';

// URL to Zillow Updated Details function
var zillowUpdatedDetails = 'http://www.zillow.com/webservice/GetUpdatedPropertyDetails.htm';

// Format and add the Zillow data to the infowindow
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

// Perform the AJAX call to Zillow
// Note that this requires a proxy since Zillow does not natively return JSONP.
// In this case, the proxy converts the returned XML to JSON.
function zillowCall(loc, API, APIParams, zillowBody) {
	// Create the URL including the proxy
	var zillowUrl = proxyUrl + API + zillowKey + APIParams;

	// Select the appropriate formatting function for the API
	var formatFn;
	if (API == zillowDeepSearch) {
		formatFn = formatDeepSearch;
	} else {
		// TODO: Add zillow UpdatedPropertyDetails option
	//	formatFn = formatUpdatedDetails;
	}

	// Initialize the request
	var xmlhttp = false;

	// Create a DOM element to hold status messages
	var zillowMsg = appendElement(zillowBody, "H5", "zillowMsg");
	appendText(zillowMsg, 'Retrieving Zillow data...');

	// Set the call to timeout after 8 seconds
	var zillowRequestTimeout = setTimeout(function(){
		hideWaitMessage();
		appendText(zillowMsg, 'Request to Zillow Timed Out.');
	}, 8000);

	// Create the proper request depending on the browser
	if (window.XMLHttpRequest) {
	try {
			xmlhttp = new XMLHttpRequest();
		} catch(e1) {
			xmlhttp = false;
		}
	} else if(window.ActiveXObject){
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e2) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e3) {
				xmlhttp = false;
			}
		}
	}

	// Set the onreadystatechange function to handle messages returned from Zillow
	if (xmlhttp) {
		xmlhttp.onreadystatechange = function(){
			switch (xmlhttp.readyState){
				case 1: appendText(zillowMsg, 'Zillow request opened.'); break;
				case 2: appendText(zillowMsg, 'Waiting for Zillow data.'); break;
				case 3: appendText(zillowMsg, 'Receiving Zillow data.'); break;
				case 4: appendText(zillowMsg, 'Waiting for Zillow data.');
						// If status is OK
						if (xmlhttp.status === 200) {
							// and JSON was returned
							var json;
							if (JSON && JSON.parse){
								// Parse the result
								json = JSON.parse(xmlhttp.responseText);
							} else {
								console.log("var json = " + xmlhttp.responseText);
							}

							if (json.message.code === '0'){
								// If Zillow response was OK, set result variable to the result
								var result = json.response.results.result;
								// If array of results, use only the most recent
								if (Array.isArray(result)) {
									result = result[0];
								}

								// Remove the Zillow message area from the DOM
								zillowBody.removeChild(zillowMsg);

								// Call the function that will format and append the Zillow data
								formatFn(loc, result, zillowBody);
							} else {
								// else display the error message
								appendText(zillowMsg, json.message.text);
							}

							// Clear the timeout and hide the processing message
							clearTimeout(zillowRequestTimeout);
							hideWaitMessage();
						}
						break;
			}
		};

		// Display wait message and open the request
		showWaitMessage();
		xmlhttp.open("GET", zillowUrl, true);
		xmlhttp.send(null);
		return true;
	} else {
		// No request created
		appendText(zillowMsg, 'Zillow Request Failed.');
		hideWaitMessage();
		return false;
	}
}

// Add Zillow required branding elements and kickoff the request function
function getZillowData(loc, zilCol){
	// Zillow branding
	var zillowHeader = appendElement(zilCol, "DIV", "zillowHeader");
	var zillowImg = appendElement(zillowHeader, "IMG");
	zillowImg.src = "http://www.zillow.com/widgets/GetVersionedResource.htm?path=/static/logos/Zillowlogo_150x40.gif";
	zillowImg.width = 150;
	zillowImg.height = 40;
	zillowImg.alt = "Zillow Real Estate Search";

	// Create div for zillow data
	var zillowBody = appendElement(zilCol, "DIV", "zillowBody");

	// Set parameters required byt the Zillow Deep Search
	var DeepSearchParams = '&address=' + encodeURIComponent(loc.Address) +
	  	'&citystatezip=' + encodeURIComponent('Madison IN 47250');

	// Send to the AJAX routine
	zillowCall(loc, zillowDeepSearch, DeepSearchParams, zillowBody);
}

// Return the index for the architectual style.
function getIconIndex(addressStyle){
	switch (addressStyle) {
		case "Federal": return 0;
		case "Italianate": return 1;
		case "Vernacular: Shotgun": return 2;
		case "Art Deco": return 3;
		case "Barn": return 4;
		case "Bridge": return 5;
		case "Bungalow/Craftsman": return 6;
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

// Decode the non-contributing reason
function decodeNCReason(reason){
	switch (reason) {
		case "NIP": return "not in period of significance.";
		case "A": return "of alterations.";
		case "DEM": return "demolished.";
		default: return "no reason found.";
	}
}

// Get a Google streetView image, looking from the street in front of the building
//	toward the center of the propery. This generally improves the resulting image,
//	but not always. Some geographic points may need improvement.
function getStreetView(loc){
	var bearing = google.maps.geometry.spherical.computeHeading(
		new google.maps.LatLng(loc.streetGeo.latitude, loc.streetGeo.longitude),
		new google.maps.LatLng(loc.latitude, loc.longitude));
	return 'http://maps.googleapis.com/maps/api/streetview?'+
			'size=200x200&location=' + loc.streetGeo.latitude+','+loc.streetGeo.longitude +
			'&heading='+bearing+'&fov=60&pitch=10';
}

// Function to format and add the National Landmark data and a streetView image
function formatNHLData(loc, NHLCol){
	var streetviewURL = getStreetView(loc);
	var c;
	if (loc["#C"] !== null) {c = loc["#C"];} else {c=0;}
	var nc;
	if (loc["#N/C"] !== null) {nc = loc["#N/C"];} else {nc=0;}
	var rating;
	if (loc["NHL Rating"] === "N/C") {
		rating = "Non-Contributing (" + nc + ")";
	} else {
		rating = "Contributing (" + c + ")";
		if (loc["#N/C"] !== null) {
			rating = rating + ", Non-Contributing (" + nc + ")";
		}
	}
	if (loc["#N/C"] !== null) {
		rating = rating + " because " + decodeNCReason(loc["N/C Reason"]);
	}
	var dateBuilt = loc.StartDate;
	if (loc.Approximate === "TRUE"){
		dateBuilt = "~" + dateBuilt;
	}
	if (loc.Range === "TRUE"){
		dateBuilt = dateBuilt + ' - ' + loc.EndDate;
	}
	var style = loc.Style;
	if (loc.SubStyle !== "None") {
		style = style + ': ' + loc.SubStyle;
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

// Function to add notes if they exist.
function formatNotes(loc, notesRow){
	if (loc.Notes.length > 0) {
		var notes = appendElement(notesRow, "P", "notes", [], loc.Notes);
		var divider = document.createElement("HR");
		notesRow.insertBefore(divider, notes);
	}
}

// Utility function to add text to a DOM element
function appendText(newParent, newContent){
	if (newContent) {
		var newText = document.createTextNode(newContent);
		newParent.appendChild(newText);
		newParent.appendChild(document.createElement("BR"));
	}
}

// Utility function to create and add DOM elements
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

// Add infowindow heading using the address and the building's name if one exists.
function formatHeading(loc, headRow){
	if (loc["Historic Name of Resource"].length > 0){
		var headingName = appendElement(headRow, "H3", "headingName", [], loc["Historic Name of Resource"]);
	}
	var headingAddress = appendElement(headRow, "H4", "headingAddress", [], loc.Address);
}

// Function to populate and display a marker's infowindow
function showDetails(loc) {
	// Create the basic structure with a heading row, two column body, and a row for notes data.
	var iw = appendElement(null, "DIV", "infowindow", ["infowindow", "container-fluid"]);
	var headRow = appendElement(iw, "DIV", "headRow", ["row"]);
	var bodyRow = appendElement(iw, "DIV", "bodyRow", ["row"]);
	var NHLCol = appendElement(bodyRow, "DIV", "NHLData", ["col-xs-12", "col-sm-6"]);
	var zilCol = appendElement(bodyRow, "DIV", "zillowData", ["col-xs-12", "col-sm-6"]);
	var notesRow = appendElement(iw, "DIV", "notesRow", ["row"]);

	// Call functions to populate the sections that come from the stored data.
	formatHeading(loc, headRow);
	formatNotes(loc, notesRow);
	formatNHLData(loc, NHLCol);

	// Display the infowindow.
	infowindow.setContent(iw);
	infowindow.open(map, loc._mapMarker);

	// Call the function to add the data from Zillow. (Happens asyncronously.)
	getZillowData(loc, zilCol);
}

// Function to add a marker to the map
function addMarker(loc) {
	// Determine appropriate marker icon
	var img = markerIconData[getIconIndex(loc.Style)];

	// Set the initial size factor
	var initSize = 0.015;

	// Set the image, initial size and scaledSize for the icon
	var markerIcon = {
		url: img.url,
		size: new google.maps.Size(img.width * initSize, img.height * initSize),
		scaledSize: new google.maps.Size(img.width * initSize, img.height * initSize)
	};

	// Instead of placing the map icon in the center of the property, place it just back
	//	from the street. In order to compute the proper location, get the center point and the
	//	street front from the stored data...
	var streetLoc = new google.maps.LatLng(loc.streetGeo.latitude, loc.streetGeo.longitude);
	var locCenter = new google.maps.LatLng(loc.latitude, loc.longitude);
	// ... compute the heading between those two points so that you can push the icon
	//	back from the street, toward the center of the property.
	var heading = google.maps.geometry.spherical.computeHeading(streetLoc,locCenter);

	// Create the map marker at a point offset by 7 from the street front point to align
	//	all of the markers evenly with the streets.
	var marker = new google.maps.Marker({
	position: new google.maps.geometry.spherical.computeOffset(streetLoc, 7, heading),
		map: map,
		title: loc.Address,
		icon: markerIcon
	});

	// Store the marker with the location data in the array
	loc._mapMarker = marker;

	// Attach the showDetails function to the marker's click function.
	google.maps.event.addListener(marker, 'click', function() {return showDetails(loc);});
}

// Function to resize icons when the zoom changes. This is so that the house icons appear
//	to get bigger as the zoom is increased. This function works fine most of the time but,
//	sometimes fails when the mouse wheel is used to zoom more than one click at a time.
function resizeIcons(locations) {
	// Get new zoom level
	var zoom = map.getZoom();

	// Compute change in zoom.
	var changeInZoom = zoom - last_zoom;

	// If no change, return from function immediately.
	if (changeInZoom === 0) return;

	// Initialize mouseZoomIssue variable
	var mouseZoomIssue = false;

	// For each location/map marker
	for (i=0; i < locations.length; i++){

		// Get the current icon
		curIcon = locations[i]._mapMarker.getIcon();

		// If the icon has a size
		if (curIcon.size) {

			// Set the new size to be double or half the previous size for each unit of change in zoom.
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

// Function to center the map on a marker, set the zoom, and display the infowindow.
function centerMarker(loc){
	map.setCenter(new google.maps.LatLng(loc.latitude, loc.longitude));
	map.setZoom(18);
	showDetails(loc);
}

// Called when the Address List is shown or hidden.
function redrawMap(){
	google.maps.event.trigger(map, "resize");
}

// Knockout utility function for string matching
ko.utils.stringStartsWith = function(string, startsWith) {
	string = string || "";
	if (startsWith.length > string.length) return false;
	return string.substring(0, startsWith.length) === startsWith;
};

// Custom binding for Google Maps
ko.bindingHandlers.googlemap = {
	// On initialization, the map is created with the given parameters.
	init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
		var value = valueAccessor();
		var mapOptions = {
			zoom: value.zoom,
			center: new google.maps.LatLng(value.centerLat, value.centerLon),
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};
		map = new google.maps.Map(element, mapOptions);

		// One infowindow is created, which is then reused for each marker.
		infowindow = new google.maps.InfoWindow();

		// locations is set to the viewModel locations.
		var locations = viewModel.locations();

		// Add a map marker for each location
		for (var i = 0; i < locations.length; i++) {
			addMarker(locations[i]);
		}

		// Initialize last_zoom global variable.
		last_zoom = value.zoom;

		// Add event for when the map's zoom is changed, so that the icons can be resized.
		google.maps.event.addListener(map, 'zoom_changed', function(){resizeIcons(locations);});
	}
};

// View Model definition
var mapViewModel = function() {
	var self = this;
	// Create locations as an observable array of markerData.
	self.locations = ko.observableArray(markerData);

	// centerOnLoc is used when a marker or address link is clicked.
	self.centerOnLoc = function(loc){centerMarker(loc);};

	// Observables are defined and given default values for each possible filter field.
	self.searchNo = ko.observable('');
	self.searchSt = ko.observable('All');
	self.searchDirs = ko.observableArray(["East","West",""]);
	self.searchRating = ko.observableArray(["C","N/C"]);
	self.searchStyle = ko.observable("All");
	self.searchDate = ko.observable(2020);

	// filteredLocs is used in the app in place of locations so that only markers and addresses
	// that satisfy the filter are displayed.
	self.filteredLocs = ko.computed(function(){
		return ko.utils.arrayFilter(self.locations(), function(loc) {

			// found returns a loc if it satisfies all of the filters
			var found =
				(self.searchNo().length === 0 || ko.utils.stringStartsWith(loc["Street Number"], self.searchNo())) &&
				(self.searchDirs().indexOf(loc["Street Direction"]) > -1 ) &&
				(self.searchSt() == 'All' || self.searchSt() == loc.Street) &&
				(self.searchRating().indexOf(loc["NHL Rating"]) > -1 ) &&
				(self.searchStyle() == 'All' || self.searchStyle() == loc.Style) &&
				(loc.EndDate <= self.searchDate());

			// The following code toggles the display of the actual map marker,
			//	display within the Address List is handled automatically by knockout.
			// TODO: Is there a way to accomplish via a custom knockout binding?
			if (typeof loc._mapMarker != 'undefined'){
				if (found) {
					loc._mapMarker.setVisible(true);
				} else {
					loc._mapMarker.setVisible(false);
				}
			}
			return found;
		});
	});

	// filteredCount is used to display the current count of addresses that satisfy the filter.
	self.filteredCount = ko.computed(function(){
		return self.filteredLocs().length;
	});
};

// Create model and apply Knockout bindings.
function loadmap(){
	ko.applyBindings(new mapViewModel());
}