var Q = require("q");
var $ = require("jquery-deferred"); // npm install jquery-deferred

var otherPromise = $.Deferred();
Q.when(otherPromise).then(console.log);
otherPromise.resolve("OK from other");

