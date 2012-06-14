var Q = require("q");

Q.reject("abc").then(function (value) {
    console.log("OK " + value);
}, function (error) {
    console.log("FAIL " + error);
});
