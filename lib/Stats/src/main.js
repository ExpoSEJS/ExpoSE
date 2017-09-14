const SET_TAG = 'set';
const SEEN_TAG = 'seen';

class Stats {
	
	constructor() {
		this.data = {};
	}

	_entry(title) {
		
		//Create a new entry if it doesn't exist
		if (!this.data[title]) {
			this.data[title] = {};
		}

		return this.data[title];
	}

	_taggedEntry(title, tag) {
		const entry = this._entry(title);
		entry.tag = tag;
		return entry;
	}

	_getSet(entry) {
		
		if (!entry.payload) {
			entry.payload = new Set();
			entry.payload.toJSON = function() {
				return Array.from(entry.payload);
			}
		}

		return entry.payload;
	}

	set(title, item) {
		const entry = this._taggedEntry(title, SET_TAG);
		const set = this._getSet(entry);
		set.add(item);
	}

	seen(title) {
		const entry = this._taggedEntry(title, SEEN_TAG);

		if (!entry.payload) {
			entry.payload = 0;
		}

		entry.payload++;
	}

	final() {
		return this.data;
	}

	export() {
		return JSON.stringify(this.data);
	}

	_mergeSet(data, title) {
		data[title].payload.forEach(item => this.set(title, item));
	}

	_mergeSeen(data, title) {
		//Just add the two payloads together for num stats
		let entry = this._taggedEntry(title, SEEN_TAG);

		if (!entry.payload) {
			entry.payload = 0;
		}

		entry.payload += data[title].payload;
	}

	_mergeField(data, title) {
		if (data[title].tag === SET_TAG) {
			this._mergeSet(data, title);
		} else if (data[title].tag === SEEN_TAG) {
			this._mergeSeen(data, title);
		}
	}

	merge(data) {
		data = JSON.parse(data);

		for (let entry in data) {
			this._mergeField(data, entry);
		}
	}
}

export default Stats;