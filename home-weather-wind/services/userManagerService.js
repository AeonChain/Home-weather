import User from "../models/user";

function getJson(req) {
	if (req.status !== 200) {
		//TODO: implement generic global error handler
		//possibly create something where i can just throw an event and handle else where not in the services
		return {};
	} else {
		return req.json();
	}
}

const defaultUserManager = {
	getUsers: () => {
		return fetch('/api/get_users', { method: 'GET' })
			.then(getJson)
			.then(res => {
				const users = res.users;
				if (users.map) {
					let mappedUsers = users.map(element => new User(element));
					return mappedUsers;
				}
				return [];
			})
			.catch((err) => {
				//TODO: implement generic global error handler
				//possibly create something where i can just throw an event and handle else where not in the services
			});
	},
	addUser: (user) => {
		const body = JSON.stringify(user);
		return fetch('/api/add_user', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: body
		}).then(res => res.json()).then(res => res.users || []);
	}
};

export default defaultUserManager;