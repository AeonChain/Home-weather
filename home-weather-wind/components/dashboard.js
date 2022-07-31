import { Component } from 'react';
import Card from './card';
import Results from './search-results';
import WeatherApiService from '../services/weatherApiService';

export default class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: props.user,
			searchTerm: '',
			searchResults: []
		};
		this.onSubmit = async function (e) {
			e.preventDefault();
			//TODO: implement minimum character count for search string 
			const results = await WeatherApiService.search(this.state.searchTerm);
			this.setState({ searchResults: results });
		}.bind(this);

		this.handleChangeValue = function (e) {
			let stateUpdate = {};
			stateUpdate[e.target.name] = e.target.value;
			this.setState(stateUpdate);
		}.bind(this);

		this.handleResetToSearch = function (e) {
			this.setState({ searchResults: [] });
		}.bind(this);
	}

	render() {
		return <div className="justify-self-center">
			<Card className="mb-2">
				<div className="grid place-items-center p-5">
					<h1 className="text-3xl">Welcome {this.state.user.name}</h1>
				</div>
			</Card>
			{this.state.searchResults.length === 0 &&
				<Card secondaryCard>
					<form className="grid place-items-center p-5" onSubmit={this.onSubmit}>
						<label htmlFor="searchTerm">New search</label>
						<input name="searchTerm" type="textbox" className="text-black" onChange={this.handleChangeValue} ></input>
						<button className="mt-5 bg-teal-300 rounded p-2 text-slate-900 font-bold">Submit</button>
					</form>
				</Card>
			}
			{this.state.searchResults.length > 0 &&
				<div className='grid grid-cols-1 place-items-center divide-y'>
					<Results results={this.state.searchResults} reset={this.handleResetToSearch}> </Results>
				</div>
			}
		</div>;
	};
}
