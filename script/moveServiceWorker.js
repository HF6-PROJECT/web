import fs from 'fs';
import 'dotenv/config';

const sourcePath = './script/serviceWorker.js';
const destinationPath = './public/serviceWorker.js';

const API_URL = process.env.PUBLIC_API_URL || '';

fs.readFile(sourcePath, { encoding: 'utf8' }, function (err, data) {
	const formatted = data.replace(/^const API_URL.*/g, `const API_URL = '${API_URL}';`);
	fs.writeFile(destinationPath, formatted, 'utf8', function (err) {
		if (err) return console.log(err);
	});
});
