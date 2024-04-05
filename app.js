var util = require("./utilities/util");
var readline = require("readline");
const jsdom = require("jsdom");
var fs = require("fs");
const { JSDOM } = jsdom;

// var DOMParser = require("DOMParser");
var coords = "latitude=55.955245&longitude=-3.193619";
var stop_id = 6200208470;
var wanted_service = "47";
var dir_data_len = 23;
var time = new Date();

var all_routes = require("./routes_all.json");
// console.log = (msg) => {
//     readline.cursorTo(process.stdout, 0);
//     process.stdout.write(`${msg}`);
// };

function get_next_departure_for_service(wanted_service, res) {
    for (let i = 0; i < res.services.length; i++) {
        if (res.services[i].service_name == wanted_service) {
            return res.services[i].departures[0];
        }
    }
}

const live_departure = async () => {
    // const response = await fetch(util.urls.nearbystops + coords);
    const res = await fetch(util.urls.departureboard + stop_id);
    const myJson = await res.json(); //extract JSON from the http response
    // do something with myJson
    departure = get_next_departure_for_service(wanted_service, myJson);
    due = departure.minutes;
    console.log(
        "Bus number " + wanted_service + " is due in " + due + " minutes "
    );
    setTimeout(response, 5000);
};

const timetable = async () => {
    const url =
        "https://lothianapi.com/timetable?route_pattern_id=2:6200200416-6200238801&date=20240405";
    const res = await fetch(url);
    const data = await res.json();
    const stops = data.timetable.routePattern.stops;
    console.log(stops);
};

const travel_dir = async (service) => {
    const url =
        "https://www.lothianbuses.com/timetable/?service_name=" + service;
    const res = await fetch(url);

    // When the page is loaded convert it to text
    var html = await res.text();
    // Initialize the DOM parser
    var parser = new JSDOM(html);

    // Parse the text
    // html.slice(290999, 291022)
    index = html.indexOf(service + ":6");
    ret = html.slice(index, index + dir_data_len + (service.length - 1));
    return ret;
    // You can now even select part of that html as you would in the regular DOM
    // Example:
    // var docArticle = doc.querySelector('article').innerHTML;
};

const routes = async () => {
    for (let i = 0; i < 3; i++) {
        var service = all_routes.routes[i].name;
        let dir = await travel_dir(service);
        if (dir.includes("'")) {
            dir = dir.slice(0, dir.indexOf("'") - 1);
        }
        dir = dir.split("-");
        let from = dir[0].split(":")[1];
        let to = dir[1];
        console.log(service + " " + from + to);
    }
};

const date_in_format = () => {
    var d = new Date();
    return (
        d.getFullYear() +
        (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)) +
        (d.getDay() > 9 ? d.getDay() : "0" + d.getDay())
    );
};
const save_timetables = async () => {
    date = date_in_format();

    for (let i = 0; i < all_routes.routes.length; i++) {
        var service = all_routes.routes[i].name;
        let dir = await travel_dir(service);
        if (dir.includes("'")) {
            dir = dir.slice(0, dir.indexOf("'") - 1);
        }
        route_pattern_id = dir;
        const url_pattern =
            util.urls.timetable + route_pattern_id + "&date=" + date;

        const timetable = await fetch(url_pattern);

        data = await timetable.text();
        // console.log(data);

        fs.writeFile("./timetables/" + service + ".json", data, console.log);
        console.log("saved timetable for service " + service);
    }
};
// lb-o-timetable-direction
// response();
