$(document).ready(function () {



    // function initMap(position) {
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
        var x = document.getElementById('map');
        var y = document.getElementById('list');
        x.innerHTML = "<h1>Geolocation is not supported by this browser.</h1>";
        y.style.display = "none";
        //potential add: if no geolocation: enter zip instead
    }
    // }

});


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
            e.innerHTML = events.length + " events found. Click the markers on the map for more information on a specific venue.";

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
    if (event._embedded.venues[0].images) {
        venuepic = event._embedded.venues[0].images[0].url;
    } else {
        venuepic = "images/noimg.jpg";
    };
    var contentString = "<div class='eventListing'><img src='" + venuepic + "' alt='" + event._embedded.venues[0].name + "' class='eventImg'><p><a href='" + event._embedded.venues[0].url +
        "'><h3 class='venueName'>" + event._embedded.venues[0].name + "</h3></a></p><p><h4 class 'venueAddress>" + event._embedded.venues[0].address.line1 + "</h4></p></div>";

    var infowindow = new google.maps.InfoWindow({
        content: contentString

    });
    //console.log(event._embedded.venues[0].name);

    var geocoder = new google.maps.Geocoder();
    var address = JSON.stringify(event._embedded.venues[0].address);

    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
            showEvents(event);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });

    // var marker = new google.maps.Marker({
    //     position: new google.maps.LatLng(event._embedded.venues[0].location.latitude, event._embedded.venues[0].location.longitude),
    //     map: map
    // });





}

function showEvents(event) {
    console.log("list item" + event);
    var eventDT = (event.dates.start.localDate + ", " + event.dates.start.localTime)
    var d1 = new Date.parse(eventDT);
    // var d2 = eventDT.parse
    console.log("date: " + d1);
    $("#listTable").append("<tr><td>" + event.name + "</td><td>" + event._embedded.venues[0].name + "</td><td>" + event.distance +
        " miles</td><td>" + d1.toString('dddd, MM/dd/dd') + "</td><td>" + d1.toString('h: mm t') +
        "</td><td>" + "<a target='_new' rel='noopener' href='" + event.url + "'><button>Buy Tickets</button></a></td></tr>");


    // $("#name").append("<p>" + event.name + "</a></p>");
    // $("#venue").append(event._embedded.venues.name);
    // $("#time").append(event.dates.start.localTime);
    // $("#date").append(event.dates.start.localDate);
    // $("#link").append("<a href='" + event.url + "'>Buy Tickets</a>");


    //add event dates, venue, time?, price?, etc


}