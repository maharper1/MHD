$(function () {
    var $propertyList = $('#propertyList');
    var $mapContainer = $('#MHDmap');
    // $propertyList.show(500).animate({ right: 0 });
    // $mapContainer.removeClass('no-transition');
    // $mapContainer.removeClass('col-md-12').addClass('col-md-10');

    $('.toggle-button').click(function () {
        $mapContainer.removeClass('no-transition');
        if ($propertyList.is(':visible') && $mapContainer.hasClass('col-lg-10')) {
            // Slide out
            $propertyList.animate({
                right: -($propertyList.outerWidth() + 10)
            }, function () {
                $propertyList.hide(1000);
            });
            $mapContainer.removeClass('col-lg-10').addClass('col-lg-12');
        }
        else {
            // Slide in
            $propertyList.show(500).animate({ right: 0 });
            $mapContainer.removeClass('col-lg-12').addClass('col-lg-10');
        }
        if($mapContainer.hasClass('col-lg-12') && $propertyList.is(':hidden')) {
        $propertyList.animate({
                right: 0
            }, function () {
                $propertyList.show(1000);
            });
        //  $menu.show();
        $mapContainer.removeClass('no-transition');
        $mapContainer.removeClass('col-lg-12').addClass('col-lg-10');
        }
    });
    $('.bs-tooltip').tooltip();
});