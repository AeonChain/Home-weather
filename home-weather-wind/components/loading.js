import { Component } from 'react';
import Card from './card';

export default class loading extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <div className="justify-self-center">
			<Card className="mb-2">
				<div className="grid place-items-center p-5">
					<h1 className="text-3xl">Loading...</h1>
				</div>
			</Card>
		</div>;
	};
}
