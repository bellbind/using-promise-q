var fs = require("fs");

var filename = "00readme.md";
var encoding = "utf-8";

fs.readFile(filename, encoding, function (error, result) {
    if (!error) console.log(result);
});
