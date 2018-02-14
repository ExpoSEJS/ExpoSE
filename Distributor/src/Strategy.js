class Strategy {
	
	constructor() {

		//Buckets can be sorted by fork point or randomly selected to change search strategy
		this._buckets = [];

		//Cache the length of the total remaining so we don't have to loop to identify len
		this._totalQueued = 0;
	}

	_findOrCreate(id) {
		let found = this._buckets.find(x => x.id == id);

		if (!found) {
			found = { id: id, entries: [], seen: 0 };
			this._buckets.push(found);
		}

		return found;
	}

	add(target, sourceInfo, coverage) {

		// Manually added paths and some edge-cases don't have a forkIid, just make one up
		const bucketId = sourceInfo ? sourceInfo.forkIid : 0;
		const bucket = this._findOrCreate(bucketId);
		bucket.entries.push(target);

		//Update total queued list
		this._totalQueued++;
	}

	_shuffle() {
	}

	_selectLeastSeen() {
		//Sort buckets by seen, find the first non empty bucket and then use the entry
		this._buckets.sort((x, y) => x.seen - y.seen);
		const firstNonEmptyBucket = this._buckets.find((x) => x.entries.length);
		firstNonEmptyBucket.seen++;
		return firstNonEmptyBucket.entries.shift();
	}

	next() {
		this._totalQueued--;
		return this._selectLeastSeen();
	}

	length() {
		return this._totalQueued;
	}
}

export default Strategy;