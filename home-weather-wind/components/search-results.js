import { Component } from 'react';
import Card from './card';
import WeatherApiService from '../services/weatherApiService';

export default class SearchResults extends Component {
	constructor(props) {
		super(props);
		this.state = {
			results: props.results
		};
	}

	handleDetailLoad(lon, lat) {
		if (!lon || !lat) {
			//TODO: Handle failure state
			return;
		}

	}

	render() {
		console.log('*owen wilson* "wow"');
		return <>
			{this.state.results.map(x => (
				<Card key={x.name + x.country} className="mb-2" secondaryCard onClick={this.handleDetailLoad(x.lon, x.lat)}>
					<div className="grid place-items-center p-5">
						<h1 className="text-3xl">{x.name} {"("}{x.country}{")"}</h1>
					</div>
				</Card>
			))}
		</>;
	};
}
