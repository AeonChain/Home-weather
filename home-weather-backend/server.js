const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const dataDirPath = './data/';
const filePaths = {
	users: dataDirPath + "users.json"
};

app.use(express.json());

app.listen(port, () => console.log(`Listening on port ${port}`));

//weather query
app.post('/search_weather', async (req, res) => {
	res.status(200);
});

//USERS
app.post('/add_user', async (req, res) => {
	const json = await readFile();
	let users = json.users || [];

	//TODO: add check for duplicate users?
	//TODO: add check req structure?
	users.push(req.body);
	const result = { users: users };
	await saveFile(result);
	res.status(200).json(result);
});

app.get('/get_users', async (req, res) => {
	const json = await readFile();
	const users = json.users || [];
	console.log(users);
	res.status(200).json({ users: users });
});

//TODO: eventually make db call instead of filesystem stuff
//TODO: should i be implementing a filelock of some sort?
function readFile() {
	const src = filePaths.users;
	const exists = fs.existsSync(src);
	if (exists) {
		return fs.promises.stat(filePaths.users).then(() => fs.promises.readFile(src).then(JSON.parse));
	}
	const data = '{"users":[]}';
	fs.writeFileSync(src, data);
	return data;
}

function saveFile(users) {
	const src = filePaths.users;
	const exists = fs.existsSync(src);
	if (exists) {
		return fs.promises.stat(src).then(() => fs.promises.writeFile(src, JSON.stringify(users)));
	}
	return {};
}