var Q = require("q");

Q.reject("uncaught").done();  // abort
