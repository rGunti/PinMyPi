var map;
var pin;

function initMap() {
    map = new google.maps.Map(document.getElementById('mapTarget'), {
        center: { lat: 51.50722, lng: 0.1275 }, /* London */
        zoom: 8
    });
}

function setMapLocation(lat,lon) {
    var pos = {lat: lat, lng: lon};
    if (!pin) {
        pin = new google.maps.Marker({
            position: pos,
            map: map,
            title: '' + lat + ', ' + lon,
            animation: google.maps.Animation.DROP
        });
    }
    pin.setPosition(pos);
    map.panTo(pos);
}

$(document).ready(function() {
    setMapLocation(51.50722, 0.1275);
});