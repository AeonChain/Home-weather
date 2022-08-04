const fs = require('fs');
const path = require('path');

module.exports = class SourceJson {
	constructor(filePath) {
		this.filePath = filePath;
	}

	//TODO: eventually make db call instead of filesystem stuff
	//TODO: should i be implementing a filelock of some sort?

	readFile() {
		const src = this.filePath;
		const exists = fs.existsSync(src);
		if (exists) {
			return fs.promises.stat(src).then(() => fs.promises.readFile(src).then(JSON.parse));
		}

		fs.mkdir(path.join(__dirname, '../data'), (err) => {
			if (err) {
				return console.error(err);
			}
			console.log('Data directory created successfully!');
		});
		const data = '{"users":[]}';
		fs.writeFileSync(src, data);
		return data;
	}

	saveFile(users) {
		const src = this.filePath;
		const exists = fs.existsSync(src);
		if (exists) {
			return fs.promises.stat(src).then(() => fs.promises.writeFile(src, JSON.stringify(users)));
		}
		return {};
	}
};
