angular.module("enilia.overlay.tpls", ["app/Config/config.html", "app/Debug/debug.html", "app/DpsMeter/dpsmeter.html", "app/DpsMeter/partials/combatant.html", "app/DpsMeter/partials/combatants.html", "app/DpsMeter/partials/encounter.html"]);

angular.module("app/Config/config.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/Config/config.html",
    "\n" +
    "<div class=\"menu\">\n" +
    "	<a href=\"#/dpsmeter\" class=\"glyphicon glyphicon-tasks\"></a>\n" +
    "</div>\n" +
    "");
}]);

angular.module("app/Debug/debug.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/Debug/debug.html",
    "\n" +
    "debug\n" +
    "\n" +
    "<div>{{loc.path()}}</div>\n" +
    "<div>{{loc.url()}}</div>\n" +
    "<div>{{loc.absUrl()}}</div>\n" +
    "");
}]);

angular.module("app/DpsMeter/dpsmeter.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/DpsMeter/dpsmeter.html",
    "\n" +
    "<div class=\"menu\">\n" +
    "	<a href=\"#/config\" class=\"glyphicon glyphicon-cog\"></a>\n" +
    "</div>\n" +
    "\n" +
    "<div>\n" +
    "	<encounter></encounter>\n" +
    "	<combatants></combatants>\n" +
    "</div>\n" +
    "");
}]);

angular.module("app/DpsMeter/partials/combatant.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/DpsMeter/partials/combatant.html",
    "\n" +
    "	<td>{{Job}}</td>\n" +
    "	<td>{{name}}</td>\n" +
    "	<td>{{encdps}}</td>\n" +
    "	<td>{{damagePct}}</td>\n" +
    "	<td>{{enchps}}</td>\n" +
    "	<td>{{healedPct}}</td>\n" +
    "	<td>{{OverHealPct}}</td>\n" +
    "\n" +
    "");
}]);

angular.module("app/DpsMeter/partials/combatants.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/DpsMeter/partials/combatants.html",
    "<div class=\"combatants\">\n" +
    "\n" +
    "	<table>\n" +
    "			<tr class=\"tableheader\">\n" +
    "				<td>Job</td>\n" +
    "				<td>Name</td>\n" +
    "				<td>DPS</td>\n" +
    "				<td>(%)</td>\n" +
    "				<td>HPS</td>\n" +
    "				<td>(%)</td>\n" +
    "				<td>overheal</td>\n" +
    "			</tr>\n" +
    "			<tr combatant ng-repeat=\"combatant in combatants\"></tr>\n" +
    "	</table>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("app/DpsMeter/partials/encounter.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/DpsMeter/partials/encounter.html",
    "<div class=\"encounter\">\n" +
    "	<div class=\"duration\">\n" +
    "		{{duration}}\n" +
    "	</div>\n" +
    "	<div class=\"encdps\">\n" +
    "		{{encounter.encdps}}\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);
