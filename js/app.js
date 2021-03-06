var $sideBar = $('#propertyList-wrapper');
var $mapContainer = $('#MHDmap');

// Toggle the display of the Address List, changing the screen real estate used as well.
$('#toggle-button').click(function () {
    if ($sideBar.is(':visible')) {
        $mapContainer.removeClass('col-xs-7 col-sm-8 col-md-9 col-lg-10').addClass('col-lg-12');
        $sideBar.removeClass('col-xs-5 col-sm-4 col-md-3 col-lg-2').addClass('hidden');
        this.innerHTML = "Show Address List";
    }
    else {
        $mapContainer.removeClass('col-lg-12').addClass('col-xs-7 col-sm-8 col-md-9 col-lg-10');
        $sideBar.removeClass('hidden').addClass('col-xs-5 col-sm-4 col-md-3 col-lg-2');
        this.innerHTML = "Hide Address List";
    }
    redrawMap();
});

// Display Contact dialog
$("#contact").click(function() {
  $("#contactModal").modal('show');
});

// Display About dialog
$("#about").click(function() {
  $("#aboutModal").modal('show');
});

// Display warning and disable keyboard input when gathering AJAX data.
//var waitDialog = document.getElementById("pleaseWaitDialog");

function showWaitMessage(){
    $("#pleaseWaitDialog").modal('show');
}

function hideWaitMessage(){
    $("#pleaseWaitDialog").modal('hide');
}

// Adjust the height of the address list depending on whether or not the
//  filter panel is showing.
$('#accordion').on('show.bs.collapse', function (e) {
    var filterHeight = 250;
    document.getElementById('propertyList').style.height = "calc(100% - " + filterHeight + "px)";
});

$('#accordion').on('hidden.bs.collapse', function (e) {
    var filterHeight = 10;
    document.getElementById('propertyList').style.height = "calc(100% - " + filterHeight + "px)";
});