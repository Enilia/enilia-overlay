;(function() {

var intervalId
  , search = {}
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
	  ;

	do {
		combatant = getCombatant("Name"+length);
		tmpCombatants.push(combatant);
		overalldps += parseInt(combatant.encdps)
	} while (length-- > 1)

	tmpCombatants.sort(function(a, b) {
		return parseFloat(a.encdps) < parseFloat(b.encdps);
	})

	tmpCombatants.forEach(function(combatant) {
		combatant["damage%"] = parseInt(combatant.encdps * 100 / overalldps) + "%";
		combatants[combatant.name] = combatant;
	})

	// for(length in combatants) {
	// 	combatants[length]["damage%"] = parseInt(combatants[length].encdps * 100 / overalldps) + "%";
	// }

	encounter.encdps = overalldps.toFixed(2);

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
		return {
			name: name,
		    "duration": getDuration(),
		    "encdps": getDPS(),
		    "crithit%": getCritPct(),
		    "misses": getMisses(),
		    "Job": getJob(),
		};
	}

	function getDuration() {
		if(duration) return duration;
		return duration = new Date().toTimeString().split(' ')[0];
	}

	function getDPS() {
		return (Math.random() * 1000).toFixed(2);
	}

	function getCritPct() {
		return parseInt(Math.random() * 20) + "%";
	}

	function getMisses() {
		return parseInt(Math.random() * 10) + "";
	}

	function getJob() {
		return jobs[parseInt(Math.random() * jobs.length)];
	}
}

}());
