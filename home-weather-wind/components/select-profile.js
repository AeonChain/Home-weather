import { Component } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import Card from './card';

export default class selectProfile extends Component {
	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			users: props.users
		};

		this.onClick = function (e) {
			e.preventDefault();
			props.select(this);
		};
	}

	render() {
		return <div className="justify-self-center">
			<Card className="mb-5">
				<div className="grid place-items-center p-5">
					<p className="text-3xl">Select profile</p>
				</div>
			</Card>
			{this.state && this.state.users && this.state.users.map((x, i) =>
				<Card className="mb-5" secondaryCard key={i}>
					<div className="p-5" onClick={this.onClick.bind(i)}>
						<p className="inline">{x.name}</p>
						<FaUserAlt className="inline float-right mt-1"></FaUserAlt>
					</div>
				</Card>
			)}
		</div>;
	};
}