var http = require("http");
var url = require("url");

http.get(url.parse("http://example.org"), function (res) {
    http.get(url.parse(res.headers["location"]), function (res) {
        var body = "";
        res.on("data", function (chunk) {
            body += chunk;
            });
        res.on("end", function () {
            console.log(body);
        });
    });
});

