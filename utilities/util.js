/**
 * Created by Manas on 07-03-2015.
 */

// var moment = require("moment");
// var bcrypt = require("bcrypt-nodejs");
// var util = require("./util");

// models
// var User = require("../models/user").User;

module.exports.urls = {
    localhost_base: "http://localhost:3000",
    all_routes: "https://lothianapi.com/routes/all",
    nearby_stops: "https://lothianapi.com/nearbyStops?", //?latitude=55.955245&longitude=-3.193619
    departure_board: "https://lothianapi.com/departureBoards/website?stops=", // id=6200208470,
    service_updates:
        "https://lothianupdates.com/api/public/getServiceUpdates?key=8094E98541294E7AC25491127FAC7A72",
    timetable: "https://lothianapi.com/timetable?route_pattern_id=", //2:6200200416-6200238801&date=20240405",
};

var parseTimetable = function (data) {
    var timepointIDs = [];

    if (data.timetable.trips.length == 0) {
        // $("#lb-l-timetable-content, #lb-l-timetable-table").hide();
        // $("#lb-l-timetable-noresults").show();
        return;
    }

    stops = data.timetable.routePattern.stops;
    currentTripIndex = 0;

    var html = "";

    for (var i = 0; i < stops.length; i++) {
        var stop = stops[i];
        var timepoint_style = "";

        if (stop.isTimingPoint) {
            timepointIDs.push(stop.id);
            // timepoint_style = " stopname-cell-timepoint";
        }

        html +=
            '<div class="stopname-cell' +
            timepoint_style +
            '"><a href="/stop/' +
            stop.id +
            '">' +
            stop.name +
            "</a></div>";
    }

    // $("#lb-o-stopnames").html(html);
    html = "";
    totalColumns = data.timetable.trips.length;

    for (var i = 0; i < data.timetable.trips.length; i++) {
        var trip = data.timetable.trips[i];
        var columnClass = "";

        if (i % 2 == 0) {
            columnClass = " lb-o-timetable-column-zebra";
        }

        html += '<div class="lb-o-timetable-column' + columnClass + '">';

        for (var j = 0; j < trip.departures.length; j++) {
            var departure = trip.departures[j];
            var cellStyle = "";

            if (departure.isTimingPoint) {
                cellStyle = " timetable-cell-stoptimepoint";
            }

            html +=
                '<div class="lb-o-timetable-column-cell' +
                cellStyle +
                '">' +
                departure.time +
                "</div>";
        }

        html += "</div>";
    }

    // $("#lb-o-timetable").html(html);
    // var columnWidth =  $("#lb-o-timetable .lb-o-timetable-column")
    //     .first()
    //     .width();
    // var startOffset = columnWidth * currentTripIndex;
    // $("#lb-o-timetable").animate({ scrollLeft: startOffset }, 0);

    // $(".stopname-cell, .lb-o-timetable-column-cell").hide();
    // $(
    //     ".stopname-cell-timepoint, .timetable-cell-stoptimepoint, #lb-l-timetable-footerbuttons"
    // ).show();

    if (timepointIDs.length != stops.length) {
        // $("#lb-o-timetable-toggleall-button").show();
    }
    return;
};
