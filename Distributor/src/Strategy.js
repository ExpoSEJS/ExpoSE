class Strategy {
	
	constructor() {
		this._targets = [];
		this._seen = {};
	}

	add(target, alternative, coverage) {

		//Range for RNG in a bracket
        const BRACKET_SIZE = 10000;
        const MAX_JUMP = 3;
		const RANDOM_PRIORITY =  -(BRACKET_SIZE * MAX_JUMP) + Math.floor(Math.random() * (BRACKET_SIZE * MAX_JUMP * 2));

		let priority = 0; 
		
		if (alternative) {
			const forkPoint = alternative.forkIid;

			if (!this._seen[forkPoint]) {
				this._seen[forkPoint] = 1;
			} else {
				this._seen[forkPoint]++;
			}

			const BRACKET = this._seen[forkPoint];
			priority = (BRACKET * BRACKET_SIZE) + RANDOM_PRIORITY;
		}

		this._targets.push({
			target: target,
			priority: priority
		});

		this._targets.sort((x, y) => x.priority - y.priority);
	}

	next() {
		console.log('Next target prio ' + this._targets[0].priority);
		return this._targets.shift().target;
	}

	length() {
		return this._targets.length;
	}
}

export default Strategy;