angular.module("enilia.overlay.tpls", ["app/Config/config.html", "app/Debug/debug.html", "app/DpsMeter/dpsmeter.html", "app/Config/partials/fieldselect.html", "app/DpsMeter/partials/combatant.html", "app/DpsMeter/partials/combatants.html", "app/DpsMeter/partials/encounter.html"]);

angular.module("app/Config/config.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/Config/config.html",
    "\n" +
    "<div class=\"menu\">\n" +
    "	<a href=\"#/dpsmeter\" class=\"glyphicon glyphicon-tasks\"></a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"config\">\n" +
    "	<div>\n" +
    "		<input type=\"checkbox\" ng-model=\"expandFromBottom\" /> expand from bottom\n" +
    "	</div>\n" +
    "	\n" +
    "	foobarbaz<fieldselect selected=\"foo\"></fieldselect>\n" +
    "\n" +
    "	<div>\n" +
    "		<button ng-click=\"save()\">Save</button>\n" +
    "	</div>\n" +
    "\n" +
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

angular.module("app/Config/partials/fieldselect.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/Config/partials/fieldselect.html",
    "<div class=\"fieldselect\" ng-class=\"{ expanded: isExpanded }\">\n" +
    "	<div class=\"selected\" ng-click=\"isExpanded = !isExpanded\">{{selected}}</div>\n" +
    "	<div class=\"fields\" ng-click=\"isExpanded = false\">\n" +
    "		<div class=\"field\" ng-click=\"selected = 'name'\">name</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'duration'\">duration</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'DURATION'\">DURATION</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'damage'\">damage</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'damage-m'\">damage-m</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'DAMAGE-k'\">DAMAGE-k</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'DAMAGE-m'\">DAMAGE-m</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'damage%'\">damage%</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'dps'\">dps</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'DPS'\">DPS</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'DPS-k'\">DPS-k</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'encdps'\">encdps</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'ENCDPS'\">ENCDPS</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'ENCDPS-k'\">ENCDPS-k</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'hits'\">hits</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'crithits'\">crithits</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'crithit%'\">crithit%</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'misses'\">misses</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'hitfailed'\">hitfailed</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'swings'\">swings</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'tohit'\">tohit</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'TOHIT'\">TOHIT</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'maxhit'\">maxhit</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'MAXHIT'\">MAXHIT</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'healed'\">healed</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'healed%'\">healed%</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'enchps'\">enchps</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'ENCHPS'\">ENCHPS</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'ENCHPS-k'\">ENCHPS-k</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'critheals'\">critheals</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'critheal%'\">critheal%</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'heals'\">heals</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'cures'\">cures</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'maxheal'\">maxheal</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'MAXHEAL'\">MAXHEAL</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'maxhealward'\">maxhealward</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'MAXHEALWARD'\">MAXHEALWARD</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'damagetaken'\">damagetaken</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'healstaken'\">healstaken</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'powerdrain'\">powerdrain</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'powerheal'\">powerheal</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'kills'\">kills</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'deaths'\">deaths</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'threatstr'\">threatstr</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'threatdelta'\">threatdelta</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'NAME3'\">NAME3</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'NAME4'\">NAME4</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'NAME5'\">NAME5</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'NAME6'\">NAME6</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'NAME7'\">NAME7</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'NAME8'\">NAME8</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'NAME9'\">NAME9</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'NAME10'\">NAME10</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'NAME11'\">NAME11</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'NAME12'\">NAME12</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'NAME13'\">NAME13</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'NAME14'\">NAME14</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'NAME15'\">NAME15</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'Last10DPS'\">Last10DPS</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'Last30DPS'\">Last30DPS</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'Last60DPS'\">Last60DPS</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'Job'\">Job</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'ParryPct'\">ParryPct</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'BlockPct'\">BlockPct</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'IncToHit'\">IncToHit</div>\n" +
    "		<div class=\"field\" ng-click=\"selected = 'OverHealPct'\">OverHealPct</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("app/DpsMeter/partials/combatant.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/DpsMeter/partials/combatant.html",
    "\n" +
    "	<!-- <td><img class=\"job\" ng-src=\"images/glow/{{Job}}.png\" /></td> -->\n" +
    "	<td class=\"job\">{{name}}</td>\n" +
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
    "				<!-- <td width=\"1em\">Job</td> -->\n" +
    "				<td width=\"6em\">Name</td>\n" +
    "				<td width=\"3em\">DPS</td>\n" +
    "				<td width=\"2em\">(%)</td>\n" +
    "				<td width=\"3em\">HPS</td>\n" +
    "				<td width=\"2em\">(%)</td>\n" +
    "				<td width=\"2em\">overheal</td>\n" +
    "			</tr>\n" +
    "			<tr combatant ng-repeat=\"combatant in combatants track by combatant.name\" ng-class=\"Job\"></tr>\n" +
    "			<tr ng-hide=\"combatants\">\n" +
    "				<td colspan=\"6\" class=\"waiting\">\n" +
    "					<div>--- Waiting for Data ---</div>\n" +
    "				</td>\n" +
    "			</tr>\n" +
    "	</table>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("app/DpsMeter/partials/encounter.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/DpsMeter/partials/encounter.html",
    "<div class=\"encounter\" ng-class=\"{active: active}\">\n" +
    "	<div class=\"duration\">\n" +
    "		{{duration}}\n" +
    "	</div>\n" +
    "	<div class=\"encdps\">\n" +
    "		{{encdps}}\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);
