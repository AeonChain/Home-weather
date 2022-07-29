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
			await saveFile(result);
			res.status(200).json(result);
		});

		app.get('/get_users', async (req, res) => {
			const json = await super.readFile();
			const users = json.users || [];
			console.log(users);
			res.status(200).json({ users: users });
		});
	}
};