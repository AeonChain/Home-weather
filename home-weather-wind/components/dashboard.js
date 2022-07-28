import { Component } from 'react';
import Card from './card';

export default class welcome extends Component {
	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			user: props.user,
			searchTerm: ''
		};
		this.onSubmit = function (e) {
			e.preventDefault();
			props.search(me.state.searchTerm);
		};

		this.handleChangeValue = function (e) {
			let stateUpdate = {};
			stateUpdate[e.target.name] = e.target.value;
			this.setState(stateUpdate);
		}.bind(this);
	}

	render() {
		return <div className="justify-self-center">
			<Card className="mb-2">
				<div className="grid place-items-center p-5">
					<h1 className="text-3xl">Welcome {this.state.user.name}</h1>
				</div>
			</Card>
			<Card secondaryCard>
				<form className="grid place-items-center p-5" onSubmit={this.onSubmit}>
					<label htmlFor="name">New search</label>
					<input name="searchTerm" type="textbox" className="text-black" onChange={this.handleChangeValue} ></input>
					<button className="mt-5 bg-teal-300 rounded p-2 text-slate-900 font-bold">Submit</button>
				</form>
			</Card>
		</div>;
	};
}
