import { Component } from 'react';
import Card from './card';
import weatherApiService from '../services/weatherApiService';
import { FaArrowUp } from 'react-icons/fa';

export default class SearchResults extends Component {
	constructor(props) {
		super(props);
		this.state = {
			results: props.results,
			selectedResult: props.selectedResult || undefined,

		};

		if (props.selected && props.selected.lon && props.selected.lat) {
			this.handleDetailLoad(props.selected.lon, props.selected.lat);
		}
		this.isFavouriteText = function () {
			const lon = this.state.selectedResult.coord.lon;
			const lat = this.state.selectedResult.coord.lat;
			if (this.props.favourites) {
				const isFound = this.props.favourites.findIndex(x => x.key === lon + '_' + lat) >= 0;
				console.log(isFound);
				return isFound ? "Remove from favourites" : "Add to favourites";
			}
			return "";
		}.bind(this);

		//this.handleDetailLoad = this.handleDetailLoad.bind(this);
		this.goBackToSearch = this.goBackToSearch.bind(this);
		this.toggleFavourite = function () {
			const lon = this.state.selectedResult.coord.lon;
			const lat = this.state.selectedResult.coord.lat;
			const name = this.state.selectedResult.name;
			const county = this.state.selectedResult.name;
			this.props.update(lon, lat, name, county);
		}.bind(this);
	}

	handleDetailLoad(lon, lat) {
		if (!lon || !lat) {
			//TODO: Handle failure state
			return;
		}
		weatherApiService.detail(lon, lat)
			.then(res => {
				this.setState({ selectedResult: res });
				this.props.recordHistory(res);
			});
	}

	goBackToSearch() {
		this.setState({ results: [], selectedResult: undefined });
		this.props.reset();
	}

	render() {
		if (this.state.selectedResult && this.state.selectedResult.wind) {
			const rotation = { transform: "rotate(" + this.state.selectedResult.wind.deg + "deg)" };
			return <>
				<span className='bg-teal-400 rounded px-4 py-2 mb-4'><h2 className='text-xl justify-self-center' onClick={this.goBackToSearch}>Back to search</h2></span>
				<Card className="mb-2" secondaryCard>
					<div className='grid place-items-center'>
						<h2 className="text-2xl">Current wind in: <br />{this.state.selectedResult.name}</h2>
						<div>
							Cardinal wind direction
						</div>
						<div style={rotation}>
							<FaArrowUp size={90}></FaArrowUp>
						</div>
						<div>
							Current speed: {this.state.selectedResult.wind.speed} (meter/sec)
						</div>
						<div>
							<button className="bg-gray-800 rounded p-5" onClick={this.toggleFavourite}>
								{this.isFavouriteText()}
							</button>
						</div>
					</div>
				</Card>
			</>;
		}
		return <>
			<span className='bg-teal-400 rounded px-4 py-2 mb-4 inline-block' onClick={this.goBackToSearch}><h2 className='text-xl justify-self-center'>Go back</h2></span>
			<span className='bg-teal-400 rounded px-4 py-2 mb-4 inline-block'><h2 className='text-xl justify-self-center'>Results</h2></span>
			{this.state.results.map(x => (
				<Card key={x.lon + "|" + x.lat} className="mb-2" secondaryCard>
					<div className="grid place-items-center p-5" onClick={() => this.handleDetailLoad.call(this, x.lon, x.lat)}>
						<h1 className="text-3xl">{x.name} {"("}{x.country}{")"}</h1>
					</div>
				</Card>
			))}
		</>;
	};
}
