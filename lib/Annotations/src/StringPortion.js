import Trait from './Trait';
import S$ from 'S$';

let StringPortion = Trait.create('StringPortion', ['start', 'end']);

Trait.extend(StringPortion, 'binary', function(inner) {
	return function(left, right, op, iAmOnTheLeft, result) {

		if (op === '+') {
			let offset = iAmOnTheLeft ? 0 : left.length;
			result = S$.assume(result).is(S$.t(S$.Top, [S$.t(StringPortion, this.params(), this.start + offset, this.end + offset)]));
		}

		return {
			result: result,
			discard: false
		}
	};
});

Trait.extend(StringPortion, '_completelyWithin', function() {
	return function(start, end, hStart, hEnd) {
		return start <= hStart && end >= hEnd;
	};
});

Trait.extend(StringPortion, '_customSubstring', function() {
	return function(f, base, args, result) {
		let startIndex = args[0];
		let endIndex = args[1] !== undefined ? args[1] : base.length;

		if (this._completelyWithin(startIndex, endIndex, this.start, this.end)) {
			let startIntersect = this.start - startIndex;
			let endIntersect = this.end - startIndex;
			result = S$.assume(result).is(S$.t(S$.Top, [S$.t(StringPortion, this.params(), startIntersect, endIntersect)]));
		}

		return result;
	};
});

Trait.extend(StringPortion, '_customMatch', function() {
	return function(f, base, args, result) {
		for (let i = 0; i < result.length; i++) {
			let index = result[i].indexOf(base.substring(this.start, this.end));
			if (index > -1) {
				result[i] = S$.assume(result[i]).is(S$.t(S$.Top, [S$.t(StringPortion, this.params(), index, index + this.end - this.start)]));
			}
		}
		return result;
	};
});

Trait.extend(StringPortion, '_customReplace', function() {
	return function(f, base, args, result) {
		let me_ua = S$.fresh_clone(base);
		me_ua = me_ua.substring(this.start, this.end);
		me_ua = me_ua.replace(args[0], args[1]);
		let index = result.indexOf(me_ua);

		if (index > -1) {
			result = S$.assume(result).is(S$.t(Top, [S$.t(StringPortion, this.params(), index, index + this.end - this.start)]));
		}

		return result;
	};
});

Trait.extend(StringPortion, 'invokedOn', function() {
	return function(f, base, args, result) {
		if (f.name === 'substring') {
			result = this._customSubstring(f, base, args, result);
		} else if (f.name === 'match') {
			result = this._customMatch(f, base, args, result);
		} else if (f.name === 'replace') {
			result = this._customReplace(f, base, args, result);
		}

		return {
			result: result,
			discard: false
		};
	};
});

export default StringPortion;
