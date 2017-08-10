import Tropigate from 'Tropigate';
const fs = require('fs');

export default function(filename) {
	return new Promise((resolve, reject) => {
		fs.readFile(filename, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(Tropigate(data));
			}
		});
	});
}