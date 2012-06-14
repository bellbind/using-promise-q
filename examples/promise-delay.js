var Q = require("q");

Q.resolve("OK").delay(5000).then(console.log);
