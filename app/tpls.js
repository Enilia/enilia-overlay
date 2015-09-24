angular.module("enilia.overlay.tpls", ["app/Config/config.html", "app/DpsMeter/dpsmeter.html", "app/Debug/debug.html", "app/Config/partials/checkbox.html", "app/Config/partials/columnConfig.html", "app/Config/partials/fieldselect.html", "app/Config/partials/sorter.html", "app/DpsMeter/partials/combatant.html", "app/Config/partials/presetConfig.html", "app/DpsMeter/partials/combatants.html", "app/DpsMeter/partials/encounter.html"]);

angular.module("app/Config/config.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/Config/config.html",
    "\n" +
    "<div class=\"menu\">\n" +
    "	<a href=\"#/dpsmeter\" class=\"glyphicon glyphicon-tasks\"></a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"config\">\n" +
    "	<!-- <div>\n" +
    "		<checkbox checked=\"confExpandFromBottom\"></checkbox> expand from bottom\n" +
    "	</div> -->\n" +
    "\n" +
    "	<div>\n" +
    "		<span ng-repeat=\"preset in presets\">\n" +
    "			<a class=\"field\" ng-href=\"#/config/preset/{{preset.name}}\">{{preset.name}}</a>\n" +
    "		</span>\n" +
    "	</div>\n" +
    "\n" +
    "	<div>\n" +
    "		<a href=\"#/dpsmeter\" class=\"glyphicon glyphicon-ok\" ng-click=\"save()\"></a>\n" +
    "	</div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("app/DpsMeter/dpsmeter.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/DpsMeter/dpsmeter.html",
    "\n" +
    "<div class=\"menu\">\n" +
    "	<a class=\"glyphicon\"\n" +
    "	   ng-class=\"{\n" +
    "	   	'glyphicon-object-align-top':		!expandFromBottom,\n" +
    "	   	'glyphicon-object-align-bottom':	expandFromBottom}\"\n" +
    "	   ng-click=\"setExpandFromBottom(!expandFromBottom)\"></a>\n" +
    "	<a href=\"#/config\" class=\"glyphicon glyphicon-cog\"></a>\n" +
    "</div>\n" +
    "\n" +
    "<div>\n" +
    "	<encounter></encounter>\n" +
    "	<combatants></combatants>\n" +
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

angular.module("app/Config/partials/checkbox.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/Config/partials/checkbox.html",
    "<span class=\"glyphicon\"\n" +
    "		ng-class=\"{\n" +
    "			'glyphicon-check':		checked,\n" +
    "			'glyphicon-unchecked':	!checked}\"\n" +
    "		ng-click=\"click()\"\n" +
    "		prevent-selection></span>\n" +
    "");
}]);

angular.module("app/Config/partials/columnConfig.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/Config/partials/columnConfig.html",
    "\n" +
    "<div ng-repeat=\"col in cols\" class=\"cols\">\n" +
    "	<span class=\"index\">({{$index}})</span>\n" +
    "	<sorter ng-model=\"cols\" index=\"$index\"></sorter>\n" +
    "	<span class=\"glyphicon glyphicon-minus\"\n" +
    "		  ng-click=\"remove($event, $index)\"\n" +
    "		  ng-class=\"{remove: removeIndex === $index}\"\n" +
    "		  prevent-selection></span>\n" +
    "	<fieldselect ng-model=\"col.name\" options=\"colsCollection\"></fieldselect>\n" +
    "</div>\n" +
    "\n" +
    "<div>\n" +
    "	<span class=\"glyphicon glyphicon-plus\" ng-click=\"add()\" prevent-selection></span>\n" +
    "</div>\n" +
    "");
}]);

angular.module("app/Config/partials/fieldselect.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/Config/partials/fieldselect.html",
    "\n" +
    "<div class=\"fieldselect\" ng-class=\"{ expanded: isExpanded }\">\n" +
    "\n" +
    "	<div class=\"selected field\"\n" +
    "		 ng-click=\"isExpanded = !isExpanded\"\n" +
    "		 prevent-selection>{{getLabel(ngModel)}}</div>\n" +
    "\n" +
    "	<div class=\"fields\" ng-click=\"isExpanded = false\">\n" +
    "		<div class=\"field\"\n" +
    "			 ng-repeat=\"option in parsedOptions\"\n" +
    "			 ng-click=\"setSelected(option)\"\n" +
    "			 prevent-selection\n" +
    "			 >\n" +
    "			 {{option.label}}</div>\n" +
    "	</div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("app/Config/partials/sorter.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/Config/partials/sorter.html",
    "<span class=\"sorter\">\n" +
    "	<span class=\"glyphicon glyphicon-chevron-up\"\n" +
    "		  ng-class=\"{disabled: $first}\"\n" +
    "		  ng-click=\"!$first &amp;&amp; up()\"\n" +
    "		  prevent-selection></span>\n" +
    "	<span class=\"glyphicon glyphicon-chevron-down\"\n" +
    "		  ng-class=\"{disabled: $last}\"\n" +
    "		  ng-click=\"!$last &amp;&amp; down()\"\n" +
    "		  prevent-selection></span>\n" +
    "</span>\n" +
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

angular.module("app/Config/partials/presetConfig.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/Config/partials/presetConfig.html",
    "\n" +
    "<div class=\"menu\">\n" +
    "	<a href=\"#/dpsmeter\" class=\"glyphicon glyphicon-tasks\"></a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"config\">\n" +
    "\n" +
    "	<div>\n" +
    "		<a href=\"#/config\" class=\"glyphicon glyphicon-arrow-left\"></a>\n" +
    "	</div>\n" +
    "\n" +
    "	<column-config cols=\"preset.cols\"></column-config>\n" +
    "\n" +
    "	<div>\n" +
    "		<a href=\"#/dpsmeter\" class=\"glyphicon glyphicon-ok\" ng-click=\"save()\"></a>\n" +
    "	</div>\n" +
    "\n" +
    "</div>\n" +
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
