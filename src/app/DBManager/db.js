
angular.module('enilia.overlay.dbmanager.db')

	.constant('DEFAULT_DB', {
			preset: 1,
			presets: [
				{
					__uid:1,
					name:'DPS',
					cols: [
						{label:  'Name',value: 'name'},
						{label:  'Dps',value: 'encdps'},
						{label:  'Dps%',value: 'damagePct'},
						{label:  'Crit%',value: 'crithitPct'},
						{label:  'Misses',value: 'misses'},
					]
				},
				{
					__uid:2,
					name:'Heal',
					cols : [
						{label:  'Name',value: 'name'},
						{label:  'Dps',value: 'encdps'},
						{label:  'Dps%',value: 'damagePct'},
						{label:  'Hps',value: 'enchps'},
						{label:  'Hps%',value: 'healedPct'},
						{label:  'OverHeal',value: 'OverHealPct'},
					]
				}
			],
			VERSION: '{#VERSION#}',
		})
