import { Component } from 'react';
import Welcome from '../components/welcome';
import SelectProfile from '../components/select-profile';
import Dashboard from '../components/dashboard';
import Loading from '../components/loading';
import userManager from '../services/userManagerService';
import User from '../models/user';

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			users: [],
			hasUsers: false,
			loggedInUser: '',
			loggedIn: false,
			waitingForApiData: true
		};
		this.handleWelcomeSubmit = this.handleWelcomeSubmit.bind(this);
		this.handleProfileSelected = this.handleProfileSelected.bind(this);
	}

	componentDidMount() {
		userManager.getUsers()
			.then(res => {
				let newState = { waitingForApiData: false };
				if (res) {
					newState.users = res;
				}
				this.setState(newState);
			})
			.catch(err => console.log(err));
	}

	async handleWelcomeSubmit(formState) {
		const newUser = new User({ name: formState.name });
		const newUsers = await userManager.addUser(newUser);
		this.setState({ users: newUsers, hasUsers: true });
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
		if (this.state.waitingForApiData) {
			return <Loading />;
		}
		if (this.state.loggedIn) {
			return <Dashboard user={this.state.loggedInUser}></Dashboard>;
		}
		if (hasUsers) {
			return <SelectProfile users={this.state.users} select={this.handleProfileSelected} />;
		}
		return <Welcome submitFunc={this.handleWelcomeSubmit} />;
	}
}