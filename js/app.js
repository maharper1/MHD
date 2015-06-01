
var $propertyList = $('#propertyList-wrapper');
var $mapContainer = $('#MHDmap');

$('#toggle-button').click(function () {
    if ($propertyList.is(':visible')) {
        $mapContainer.removeClass('col-xs-7 col-sm-8 col-md-8 col-lg-9').addClass('col-lg-12');
        $propertyList.removeClass('col-xs-5 col-sm-4 col-md-4 col-lg-3').addClass('hidden');
        this.innerHTML = "Show Address List";
    }
    else {
        $mapContainer.removeClass('col-lg-12').addClass('col-xs-7 col-sm-8 col-md-8 col-lg-9');
        $propertyList.removeClass('hidden').addClass('col-xs-5 col-sm-4 col-md-4 col-lg-3');
        this.innerHTML = "Hide Address List"
    }
    redrawMap();
});

$("#contact").click(function() {
  alert('contact clicked');
});

$("#about").click(function() {
  alert('about clicked');
});

var waitDialog = document.getElementById("pleaseWaitDialog");

function showWaitMessage(){
    $("#pleaseWaitDialog").modal('show');
}

function hideWaitMessage(){
    $("#pleaseWaitDialog").modal('hide');
}
