function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        var x = document.getElementById("location");
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    var latlon = position.coords.latitude + "," + position.coords.longitude;

    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/events.json?apikey=5QGCEXAsJowiCI4n1uAwMlCGAcSNAEmG&latlong=" + latlon,
        async: true,
        dataType: "json",
        success: function (json) {
            console.log(json);
            var e = document.getElementById("events");
            e.innerHTML = json.page.totalElements + " events found.";
            showEvents(json);
            initMap(position, json);
        },
        error: function (xhr, status, err) {
            console.log(err);
        }
    });



}

function showEvents(json) {
    for (var i = 0; i < json.page.size; i++) {
        $("#events").append("<p><a href='" + json._embedded.events[i].url + "'>" + json._embedded.events[i].name + "</a></p>");
        //make clickable links to access ticket info from api
        //  ._embedded.events["0"].url
    }
}


function initMap(position, json) {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
        center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        },
        zoom: 10
    });
    for (var i = 0; i < json.page.size; i++) {
        addMarker(map, json._embedded.events[i]);
    }
}

function addMarker(map, event) {
    //build template for infowindow with venue, artist, and pic
    var contentString = "";


    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });


    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(event._embedded.venues[0].location.latitude, event._embedded.venues[0].location.longitude),
        map: map
    });


    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    console.log(marker);

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });
}




getLocation();