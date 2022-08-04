const SourceJson = require('./sourceJson');

module.exports = class UserCalls extends SourceJson {
	constructor(app, filePath) {
		super(filePath);
		this.app = app;

		app.post('/add_user', async (req, res) => {
			const json = await super.readFile();
			let users = json.users || [];

			//TODO: add check for duplicate users?
			//TODO: add check req structure?
			users.push(req.body);
			const result = { users: users };
			await super.saveFile(result); //not sure why this isn't committed correctly
			res.status(200).json(result);
		});

		app.get('/get_users', async (req, res) => {
			const json = await super.readFile();
			const users = json.users || [];
			console.log(users);
			res.status(200).json({ users: users });
		});
		app.post('/update_user', async (req, res) => {
			const json = await super.readFile();
			const users = json.users || [];
			const updatedUser = req.body;
			const index = users.findIndex(x => x.name === updatedUser.name);
			users[index] = updatedUser;
			const result = { users: users };
			await super.saveFile(result); //not sure why this isn't committed correctly
			console.log(users[index]);
			res.status(200).json(users[index]);
		});
	}
};