var map;
var pin;

var pins = {};
var infoWindows = {};
var selectedDevice = null;

function initMap() {
    map = new google.maps.Map(document.getElementById('mapTarget'), {
        center: { lat: 51, lng: 0 },
        zoom: 8
    });
    init();
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

function selectDevice(id) {
    // Set active
    $('#deviceList a').removeClass('active');
    $('#deviceList a[data-id=' + id + ']').addClass('active');

    selectedDevice = $(this).data('id');
}

function init() {
    //setMapLocation(51.50722, 0.1275);
    update(function() {
        if (window.location.hash && window.location.hash.length > 1) {
            selectDevice(window.location.hash.substr(1));
        }
        updateLoop();
    });
}

function updateLoop() {
    update(function() {
        setTimeout(updateLoop, 2500);
    });
}

function update(callback) {
    $.ajax({
        url: APP_BASE_URL + '/map/update.ajax',
        method: 'GET'
    }).done(function(obj) {
        var points = obj.data;
        for (var deviceId in points) {
            var point = points[deviceId];
            if (!point) continue;
            var coord = new google.maps.LatLng(point.latitude, point.longitude);

            var pin;
            if (deviceId in pins) {
                pin = pins[deviceId];
                var infoWindow = infoWindows[deviceId];
                pin.setPosition(coord);
                infoWindow.setContent(getContentString(point));
            } else {
                pin = new google.maps.Marker({
                    position: coord,
                    map: map,
                    title: 'Device #' + point.device_id,
                    animation: google.maps.Animation.DROP
                });
                var infoWindow = new google.maps.InfoWindow({
                    content: getContentString(point)
                });

                pin.addListener('click', function() {
                    infoWindow.open(map, pin);
                });

                pins[deviceId] = pin;
                infoWindows[deviceId] = infoWindow;
            }

            map.panTo(coord);
        }

        if (callback) callback();
    }).fail(function() {
        console.log(arguments);
    });
}

function getContentString(point) {
    return '<div class="content">'
        + '<h3>Device #' + point.device_id + '</h3>'
        + '<div id="bodyContent">'
        + 'Latitude: ' + point.latitude + '<br>'
        + 'Longitude: ' + point.longitude + '<br>'
        + 'Last updated at: ' + point.updatedAt
        + '</div>'
        + '</div>';
}

$(document).ready(function() {
    $('#deviceList a').click(function() {
        var self = $(this);
        selectDevice(self.data('id'));
    });
});
