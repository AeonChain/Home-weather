import { Component } from 'react';
import Card from './card';

export default class welcome extends Component {
	constructor(props) {
		super(props);
		const me = this;
		this.onSubmit = function (e) {
			e.preventDefault();
			props.submitFunc(me.state);
		};
		this.state = {
			name: ''
		};
		this.handleChangeName = this.handleChangeName.bind(this);
	}

	handleChangeName(e) {
		this.setState({ name: e.target.value });
	}

	render() {
		return <div className="justify-self-center">
			<Card className="mb-2">
				<div className="grid place-items-center p-5">
					<h1 className="text-3xl">Welcome</h1>
					<p>We can't find any profiles.</p>
					<p>Please enter a name below to begin</p>
				</div>
			</Card>

			<Card secondaryCard>
				<form className="grid place-items-center p-5" onSubmit={this.onSubmit}>
					<label htmlFor="name">Name</label>
					<input name="name" type="textbox" className="text-black" onChange={this.handleChangeName} ></input>
					<button className="mt-5 bg-teal-300 rounded p-2 text-slate-900 font-bold">Submit</button>
				</form>
			</Card>
		</div>;
	};
}
