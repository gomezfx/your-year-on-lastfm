var page = require("webpage").create();
var system = require("system");

page.onConsoleMessage = function(message) {
    system.stderr.writeLine(message);
};

page.open("http://localhost:8000/index.html", function() {
  phantom.exit();
});