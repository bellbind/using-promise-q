var http = require("http");
var url = require("url");

http.get(url.parse("http://example.org/"), function (res) {
    console.log(res.statusCode);  // maybe 302
    http.get(url.parse(res.headers["location"]), function (res) {
        console.log(res.statusCode);  // maybe 200
    });
});
