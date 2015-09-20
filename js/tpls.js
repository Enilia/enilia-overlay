angular.module("enilia.overlay.tpls", ["templates/config.html", "templates/debug.html", "templates/dpsmeter.html"]);

angular.module("templates/config.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/config.html",
    "\n" +
    "<a href=\"#/\">config</a>\n" +
    "");
}]);

angular.module("templates/debug.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/debug.html",
    "\n" +
    "debug\n" +
    "\n" +
    "<div>{{loc.path()}}</div>\n" +
    "<div>{{loc.url()}}</div>\n" +
    "<div>{{loc.absUrl()}}</div>\n" +
    "");
}]);

angular.module("templates/dpsmeter.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/dpsmeter.html",
    "\n" +
    "<a href=\"#/config\">config</a>\n" +
    "\n" +
    "<pre>{{$route | json}}</pre>\n" +
    "");
}]);
