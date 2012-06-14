var Q = require("q");

Q.resolve("OK").timeout(5000).then(console.log);
Q.resolve("OK").delay(10000).timeout(5000).then(null, console.log);
