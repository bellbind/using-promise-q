var Q = require("q");
var promise = require("node-promise"); // npm install node-proimse

var otherPromise = new promise.Promise();
Q.when(otherPromise).then(console.log);
otherPromise.resolve("OK from other");
