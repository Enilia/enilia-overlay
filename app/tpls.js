angular.module("enilia.overlay.tpls", [
	"app/Config/config.html",
	"app/Config/partials/formcontrols/checkbox.html",
	"app/Config/partials/formcontrols/columnConfig.html",
	"app/Config/partials/formcontrols/fieldselect.html",
	"app/Config/partials/formcontrols/sorter.html",
	"app/Config/partials/preset.html",
	"app/Debug/debug.html",
	"app/DpsMeter/dpsmeter.html",
	"app/DpsMeter/partials/combatant.html",
	"app/DpsMeter/partials/combatants.html",
	"app/DpsMeter/partials/encounter.html",
]);

angular.module("app/Config/config.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/Config/config.html",
    "\n" +
    "<div class=\"menu\">\n" +
    "	<a href=\"#/dpsmeter\" class=\"glyphicon glyphicon-tasks\"></a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"config\">\n" +
    "\n" +
    "	<div>\n" +
    "		<h1>Presets</h1>\n" +
    "		<div ng-repeat=\"preset in presets\">\n" +
    "			<span class=\"glyphicon\"\n" +
    "				  ng-click=\"remove($event, preset)\"\n" +
    "				  ng-class=\"{\n" +
    "				    'glyphicon-minus': checkRemove !== preset,\n" +
    "				  	'glyphicon-trash': checkRemove === preset,\n" +
    "				  	'remove': checkRemove === preset\n" +
    "				  }\"\n" +
    "				  prevent-selection></span>\n" +
    "			<a \n" +
    "			   class=\"glyphicon glyphicon-eye-open\"></a>\n" +
    "			<a ng-href=\"#/config/preset/{{preset.__uid}}/clone\"\n" +
    "			   class=\"glyphicon glyphicon-duplicate\"></a>\n" +
    "			<a ng-href=\"#/config/preset/{{preset.__uid}}/edit\"\n" +
    "			   class=\"glyphicon glyphicon-wrench\"></a>\n" +
    "			<span class=\"field\"\n" +
    "				  ng-class=\"{selected: selectedPreset === preset}\"\n" +
    "				  ng-click=\"select(preset)\"\n" +
    "				  >{{preset.name}}</span>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	<div>\n" +
    "		<a ng-href=\"#/config/preset/new\"\n" +
    "		   class=\"glyphicon glyphicon-plus\"></a>\n" +
    "	</div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("app/Config/partials/formcontrols/checkbox.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/Config/partials/formcontrols/checkbox.html",
    "<span class=\"glyphicon\"\n" +
    "		ng-class=\"{\n" +
    "			'glyphicon-check':		checked,\n" +
    "			'glyphicon-unchecked':	!checked}\"\n" +
    "		ng-click=\"click()\"\n" +
    "		prevent-selection></span>\n" +
    "");
}]);

angular.module("app/Config/partials/formcontrols/columnConfig.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/Config/partials/formcontrols/columnConfig.html",
    "\n" +
    "<div ng-repeat=\"col in cols\" class=\"cols\">\n" +
    "	<span class=\"index\">({{$index}})</span>\n" +
    "	<sorter ng-model=\"cols\" index=\"$index\"></sorter>\n" +
    "	<span class=\"glyphicon\"\n" +
    "		  ng-click=\"remove($event, $index)\"\n" +
    "		  ng-class=\"{\n" +
    "		    'glyphicon-minus': removeIndex !== $index,\n" +
    "		  	'glyphicon-trash': removeIndex === $index,\n" +
    "		  	remove: removeIndex === $index\n" +
    "		  }\"\n" +
    "		  prevent-selection></span>\n" +
    "	<fieldselect ng-model=\"col.name\" options=\"colsCollection\"></fieldselect>\n" +
    "</div>\n" +
    "<div>\n" +
    "	<span class=\"index\">({{cols.length}})</span>\n" +
    "	<sorter ng-model=\"newcol\" index=\"0\"></sorter>\n" +
    "	<span class=\"glyphicon glyphicon-plus\"\n" +
    "		  ng-click=\"add(newcol[0])\"\n" +
    "		  prevent-selection></span>\n" +
    "	<fieldselect ng-model=\"newcol[0].name\" options=\"colsCollection\"></fieldselect>\n" +
    "</div>\n" +
    "");
}]);

angular.module("app/Config/partials/formcontrols/fieldselect.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/Config/partials/formcontrols/fieldselect.html",
    "\n" +
    "<div class=\"fieldselect\" ng-class=\"{ expanded: isExpanded }\">\n" +
    "\n" +
    "	<div class=\"selected field\"\n" +
    "		 ng-click=\"isExpanded = !isExpanded\"\n" +
    "		 prevent-selection>{{selectedLabel}}</div>\n" +
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

angular.module("app/Config/partials/formcontrols/sorter.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/Config/partials/formcontrols/sorter.html",
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

angular.module("app/Config/partials/preset.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/Config/partials/preset.html",
    "\n" +
    "<div class=\"menu\">\n" +
    "	<a href=\"#/dpsmeter\" class=\"glyphicon glyphicon-tasks\"></a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"config\">\n" +
    "\n" +
    "	<div style=\"display:flex\">\n" +
    "		<span style=\"flex: 0 0 auto\">Name: </span><input type=\"text\" ng-model=\"preset.name\" />\n" +
    "	</div>\n" +
    "\n" +
    "	<div>\n" +
    "		<a href=\"#/config\" class=\"glyphicon glyphicon-arrow-left\"></a>\n" +
    "	</div>\n" +
    "\n" +
    "	<column-config cols=\"preset.cols\"></column-config>\n" +
    "\n" +
    "	<div>\n" +
    "		<a href=\"#/config\" class=\"glyphicon glyphicon-ok\" ng-click=\"save()\"></a>\n" +
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
    "	<a class=\"glyphicon\"\n" +
    "	   ng-class=\"{\n" +
    "	   	'glyphicon-object-align-top':		!expandFromBottom,\n" +
    "	   	'glyphicon-object-align-bottom':	expandFromBottom}\"\n" +
    "	   ng-click=\"setExpandFromBottom(!expandFromBottom)\"></a>\n" +
    "	<a href=\"#/config\" class=\"glyphicon glyphicon-cog\"></a>\n" +
    "</div>\n" +
    "\n" +
    "<div>\n" +
    "	<encounter encounter=\"encounter\" active=\"active\"></encounter>\n" +
    "	<combatants combatants=\"combatants\"></combatants>\n" +
    "</div>\n" +
    "");
}]);

angular.module("app/DpsMeter/partials/combatant.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/DpsMeter/partials/combatant.html",
    "\n" +
    "	<td class=\"job\">{{combatant.name}}</td>\n" +
    "	<td>{{combatant.encdps}}</td>\n" +
    "	<td>{{combatant.damagePct}}</td>\n" +
    "	<td>{{combatant.enchps}}</td>\n" +
    "	<td>{{combatant.healedPct}}</td>\n" +
    "	<td>{{combatant.OverHealPct}}</td>\n" +
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
    "			<tr combatant=\"combatant\" bestdps=\"bestdps\" ng-repeat=\"combatant in combatants track by combatant.name\" ng-class=\"combatant.Job\"></tr>\n" +
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
    "		{{encounter.duration}}\n" +
    "	</div>\n" +
    "	<div class=\"encdps\">\n" +
    "		{{encounter.encdps}}\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);
