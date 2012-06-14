var Q = require("q");

Q.resolve("abc").then(function (value) {
    return Q.reject("FAIL");
}).then(null, function (error) {
    console.log(error);
});
