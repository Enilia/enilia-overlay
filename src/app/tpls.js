angular.module('enilia.overlay.tpls', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/Config/config.html',
    "<div class=config><h1>Presets</h1><div class=presets-collection><div ng-repeat=\"preset in presets\" class=preset-line><div class=controls><a class=\"glyphicon delete\" ng-click=\"remove($event, preset)\" ng-class=\"{\r" +
    "\n" +
    "\t\t\t\t\t    'glyphicon-minus': checkRemove !== preset,\r" +
    "\n" +
    "\t\t\t\t\t  \t'glyphicon-trash': checkRemove === preset,\r" +
    "\n" +
    "\t\t\t\t\t  \t'remove': checkRemove === preset\r" +
    "\n" +
    "\t\t\t\t\t  }\" ng-href=#/config/preset/{{preset.id}}/delete prevent-selection></a> <a class=\"glyphicon glyphicon-eye-open disabled preview\"></a> <a ng-href=#/config/preset/{{preset.id}}/clone class=\"glyphicon glyphicon-duplicate clone\"></a> <a ng-href=#/config/preset/{{preset.id}}/edit class=\"glyphicon glyphicon-wrench edit\"></a></div><span class=\"field preset\" ng-class=\"{selected: selectedPreset === preset}\" ng-click=select(preset)>{{preset.name}}</span></div></div><div><a ng-href=#/config/preset/new class=\"glyphicon glyphicon-plus add\"></a></div></div>"
  );


  $templateCache.put('app/Config/partials/delete.html',
    "<div class=config><h1>{{title}}: {{preset.name}}</h1><div class=preset-name>Are you sure ?</div><div><a href=#/config class=\"glyphicon glyphicon-arrow-left\"></a> <a href=#/config class=\"glyphicon glyphicon-ok\" ng-click=delete($event)></a></div></div>"
  );


  $templateCache.put('app/Config/partials/formcontrols/checkbox.html',
    "<span class=\"glyphicon checkbox\" ng-class=\"{\r" +
    "\n" +
    "\t\t\t'glyphicon-check':\t\tchecked,\r" +
    "\n" +
    "\t\t\t'glyphicon-unchecked':\t!checked}\" ng-click=click() prevent-selection></span>"
  );


  $templateCache.put('app/Config/partials/formcontrols/fieldselect.html',
    "<div class=fieldselect ng-class=\"{ expanded: isExpanded }\"><div class=\"selected field\" ng-click=\"isExpanded = !isExpanded\" prevent-selection>{{selectedLabel}}</div><div class=fields ng-click=\"isExpanded = false\"><div class=field ng-repeat=\"option in parsedOptions\" ng-click=setSelected(option) prevent-selection>{{option.label}}</div></div></div>"
  );


  $templateCache.put('app/Config/partials/formcontrols/presetConfig.html',
    "<div ng-repeat=\"col in cols\" class=preset-col><div class=controls><span class=preset-col-index>({{$index}})</span><sorter ng-model=cols index=$index></sorter><span class=\"glyphicon delete\" ng-click=\"remove($event, $index)\" ng-class=\"{\r" +
    "\n" +
    "\t\t\t    'glyphicon-minus': removeIndex !== $index,\r" +
    "\n" +
    "\t\t\t  \t'glyphicon-trash': removeIndex === $index,\r" +
    "\n" +
    "\t\t\t  \tremove: removeIndex === $index\r" +
    "\n" +
    "\t\t\t  }\" prevent-selection></span></div><fieldselect ng-model=col.value options=colsCollection label=label value=value></fieldselect><input ng-model=col.label class=preset-col-label auto-select></div><div class=\"preset-col preset-col-template\"><div class=controls><span class=preset-col-index>({{cols.length}})</span><sorter ng-model=newcol index=0></sorter><span class=\"glyphicon glyphicon-plus add\" ng-click=add(newcol[0]) prevent-selection></span></div><fieldselect ng-model=newcol[0] options=colsCollection label=label></fieldselect><input ng-model=newcol[0].label class=preset-col-label auto-select></div>"
  );


  $templateCache.put('app/Config/partials/formcontrols/sorter.html',
    "<span class=\"glyphicon glyphicon-chevron-up sorter-up\" ng-class=\"{disabled: $first}\" ng-click=\"!$first &amp;&amp; up()\" prevent-selection></span> <span class=\"glyphicon glyphicon-chevron-down sorter-down\" ng-class=\"{disabled: $last}\" ng-click=\"!$last &amp;&amp; down()\" prevent-selection></span>"
  );


  $templateCache.put('app/Config/partials/preset.html',
    "<div class=config><h1>{{title}}: {{preset.name}}</h1><div class=preset-name><span>Name:</span><input ng-model=\"preset.name\"></div><preset-config cols=preset.cols></preset-config><div><a href=#/config class=\"glyphicon glyphicon-arrow-left\"></a> <a href=#/config class=\"glyphicon glyphicon-ok\" ng-click=save($event)></a></div></div>"
  );


  $templateCache.put('app/DBManager/partials/load.html',
    ""
  );


  $templateCache.put('app/DBManager/partials/userNotFound.html',
    "<p>user not found: {{user}}</p>"
  );


  $templateCache.put('app/Debug/404.html',
    "<p>Oops! Looks like the ressource you requested does not exist</p><div>Requested ressource:</div><div>{{path}}</div>"
  );


  $templateCache.put('app/Debug/debug.html',
    "<p>Ooops! Looks like something went wrong<br>Please send the following informations to the developper with a detailled explanation of what you were trying to achieve before breaking his work, he will surely know what to do with it and fix the problem <small>(or ditch it under a rag, pretending nothing happened... ever. Who knows ?)</small></p><div>{{path}}</div>"
  );


  $templateCache.put('app/DpsMeter/dpsmeter.html',
    "<div><encounter encounter=encounter active=active></encounter><combatants combatants=combatants></combatants></div>"
  );


  $templateCache.put('app/DpsMeter/partials/combatant.html',
    "<td ng-repeat=\"col in cols track by $index\" ng-class=\"[{job: $first}, col.value]\">{{combatant[col.value]}}</td>"
  );


  $templateCache.put('app/DpsMeter/partials/combatants.html',
    "<div class=combatants><table><tr class=tableheader><th class=header ng-repeat=\"header in headers track by $index\" ng-class=header.value>{{header.label}}</th></tr><tr combatant=combatant bestdps=bestdps ng-repeat=\"combatant in combatants track by combatant.name\" ng-class=combatant.Job class=combatant></tr><tr ng-hide=combatants><td colspan={{headers.length}}} class=waiting><div class=message>--- Waiting for Data ---</div></td></tr></table></div>"
  );


  $templateCache.put('app/DpsMeter/partials/encounter.html',
    "<div class=encounter ng-class=\"{active: active}\"><div class=encounter-duration>{{encounter.duration}}</div><div class=encounter-encdps>{{encounter.encdps}}</div></div>"
  );


  $templateCache.put('app/Message/message.html',
    "<div ng-repeat=\"message in messages\" class=message><div class=message-title><div class=controls><span class=\"glyphicon glyphicon-trash delete\" ng-click=remove(message) prevent-selection></span></div>{{message.title}}</div><pre class=message-content>\r" +
    "\n" +
    "{{message.content}}\r" +
    "\n" +
    "({{message.error.code}}) {{message.error.message}}\r" +
    "\n" +
    "\t</pre></div>"
  );


  $templateCache.put('app/Message/partials/menuicon.html',
    "<a href=#/messages class=\"glyphicon glyphicon-envelope menu-item message-icon\" ng-class=\"{unread: message, plus: plus}\"><span class=unread>{{message}}</span></a>"
  );


  $templateCache.put('app/Navigation/partials/navigation.html',
    "<div class=menu><message></message><span ng-if=\"location == '/dpsmeter'\"><a class=\"glyphicon menu-item\" ng-class=\"{\r" +
    "\n" +
    "\t\t   \t'glyphicon-object-align-top':\t\t!expandFromBottom,\r" +
    "\n" +
    "\t\t   \t'glyphicon-object-align-bottom':\texpandFromBottom}\" ng-click=setExpandFromBottom(!expandFromBottom) prevent-selection></a></span> <span ng-if=\"location != '/dpsmeter'\"><a href=#/dpsmeter class=\"glyphicon glyphicon-tasks menu-item\"></a></span> <span ng-if=\"location != '/config'\"><a href=#/config class=\"glyphicon glyphicon-cog menu-item\"></a></span></div>"
  );

}]);
