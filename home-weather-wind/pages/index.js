import { Component } from 'react';
import Welcome from '../components/welcome';
import SelectProfile from '../components/select-profile';
import Dashboard from '../components/dashboard';

// export default function Home() {
// 	let Users = useState();
// 	const hasData = false;
// 	return (
// 		<GetComponent hasData={hasData} />
// 	);
// }

class User {
	constructor(name) {
		this.name = name;
		this.favourites = [];
	}

	addFavourite(location) {
		this.favourites.push(location);
	}
}

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			users: [],
			hasUsers: false,
			loggedInUser: '',
			loggedIn: false
		};
		this.handleWelcomeSubmit = this.handleWelcomeSubmit.bind(this);
		this.handleProfileSelected = this.handleProfileSelected.bind(this);
	}

	handleWelcomeSubmit(formState) {
		this.setState({ users: [...this.state.users, new User(formState.name)], hasUsers: true });
	}

	handleProfileSelected(index) {

		if (this.state.users[index]) {
			this.setState({ loggedInUser: this.state.users[index], loggedIn: true });
		} else {
			//TODO: handle failure
		}
	}

	render() {
		const hasUsers = this.state.users.length;
		if (this.state.loggedIn) {
			return <Dashboard user={this.state.loggedInUser}></Dashboard>;
		}
		if (hasUsers) {
			return <SelectProfile users={this.state.users} select={this.handleProfileSelected} />;
		}
		return <Welcome submitFunc={this.handleWelcomeSubmit} />;
	}
}