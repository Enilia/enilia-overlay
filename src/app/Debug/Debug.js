;(function() {

var intervalId
  , search = {}
  , staticCombatants = {}
  ;

window.start = start;
window.stop = stop;
window.step = dispatch;

document.addEventListener('DOMContentLoaded', function() {

	if(location.search) {
		location.search.slice(1).split('&').forEach(function(v) {
			var value = v.split('=')
			search[value[0]] = value[1] || true;
		})
		if(search.d) { // debug
			if(search.s) { // step
				dispatch(parseInt(search.c))
			} else {
				dispatch(parseInt(search.c))
				start(parseInt(search.c), search.i)
			}
		}
	}

}, false);

function start(c, i) {
	stop();
	dispatch(c);
	intervalId = setInterval(dispatch, i || 1000, c);
}

function stop() {
	intervalId = clearInterval(intervalId);
}

function dispatch(c) {
	var encounter = {
		    "duration": getDuration(),
		}
	  , combatants = {}
	  , tmpCombatants = []
	  , combatant
	  , jobs = ["Arc","Ast","Blm","Brd","Drg","Drk","Gld","Mch","Mnk","Nin","Pld","Sch","Smn","War","Whm"]
	  , duration
	  , length = c || parseInt(Math.random() * 8 + 1)
	  , overalldps = 0
	  , overallLast10Dps = 0
	  ;

	do {
		combatant = getCombatant("fName"+length + " lName");
		tmpCombatants.push(combatant);
		overalldps += parseInt(combatant.encdps)
		overallLast10Dps += parseInt(combatant.Last10DPS)
	} while (length-- > 1)

	tmpCombatants.sort(function(a, b) {
		return parseFloat(a.encdps) < parseFloat(b.encdps);
	})

	tmpCombatants.forEach(function(combatant) {
		combatant["damage%"] = parseInt(combatant.encdps * 100 / overalldps) + "%";
		combatants[combatant.name] = combatant;
	})

	encounter.encdps = overalldps.toFixed(2);
	encounter.Last10DPS = overallLast10Dps.toFixed(2);

	// Dispatch the event.
	document.dispatchEvent(
		new CustomEvent('onOverlayDataUpdate', {
			'detail': {
				"Encounter": encounter,
				"Combatant": combatants
			}
		})
	);

	function getCombatant(name) {
		if(!staticCombatants[name]) {
			staticCombatants[name] = {
				dps: Math.random() * 1000,
				job: jobs[parseInt(Math.random() * jobs.length)],
			}
		}

		return {
			name: name,
		    "duration": getDuration(),
		    "encdps": getDPS(name),
		    "Last10DPS": getLast10DPS(name),
		    "crithit%": getCritPct(),
		    "misses": getMisses(),
		    "Job": getJob(name),
		};
	}

	function getDuration() {
		if(duration) return duration;
		return duration = new Date().toTimeString().split(' ')[0];
	}

	function getDPS(name) {
		return (staticCombatants[name].dps + Math.random() * 100).toFixed(2);
	}

	function getLast10DPS(name) {
		return (staticCombatants[name].dps + Math.random() * 100).toFixed(2);
	}

	function getCritPct() {
		return parseInt(Math.random() * 20) + "%";
	}

	function getMisses() {
		return parseInt(Math.random() * 10) + "";
	}

	function getJob(name) {
		return staticCombatants[name].job;
	}
}

}());
