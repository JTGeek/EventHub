function initMap(position) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var mapDiv = document.getElementById('map');
            var map = new google.maps.Map(mapDiv, {
                center: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                zoom: 10
            });

            mapEvents(map, position);

        });
    } else {
        var x = document.getElementById("location");
        x.innerHTML = "Geolocation is not supported by this browser.";
        //potential add: if no geolocation: enter zip instead
    }
}


function mapEvents(map, position) {
    var latlon = position.coords.latitude + "," + position.coords.longitude;

    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/events.json?apikey=5QGCEXAsJowiCI4n1uAwMlCGAcSNAEmG&latlong=" + latlon,
        async: true,
        dataType: "json",
        success: function (json) {
            //filter out json array, for images and embedded subdoc
            // console.log(json);
            var events = json._embedded.events;
            var e = document.getElementById("events");
            e.innerHTML = events.length + " events found. Click the markers on the map for more information.";

            console.log(json);
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                addMarker(map, event);
            };

        },
        error: function (xhr, status, err) {
            console.log(err);
        }
    });
}

function addMarker(map, event) {
    var contentString = "<div class='eventListing'><img src='" + event.images[0].url + "' alt='" + event.images[0].attribution + "' class='eventImg'><p class='title'><a href='" + event.url + "'>" + event.name + "</a></p></div>";

    var infowindow = new google.maps.InfoWindow({
        content: contentString

    });
    //console.log(event._embedded.venues[0].name);

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(event._embedded.venues[0].location.latitude, event._embedded.venues[0].location.longitude),
        map: map
    });


    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });
    showEvents(event);
}

function showEvents(event) {
    console.log("list item" + event);
    $("#listing").append("<p><a href='" + event.url + "'>" + event.name + "</a></p>");

    //add event dates, venue, time?, price?, etc


}