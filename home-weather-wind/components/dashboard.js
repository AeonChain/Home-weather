import { Component } from 'react';
import Card from './card';
import Results from './search-results';
import WeatherApiService from '../services/weatherApiService';
import UserManager from '../services/userManagerService';

export default class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: props.user,
			searchTerm: '',
			searchResults: [],
			showingSearch: true,
			showingFavourites: false,
			showingHistory: false,
			hideSubMenu: false,
			selected: undefined
		};
		this.onSubmit = async function (e) {
			e.preventDefault();
			//TODO: implement minimum character count for search string 
			await WeatherApiService.search(this.state.searchTerm)
				.then(res => {
					this.setState({ searchResults: res, hideSubMenu: true });
				});
		}.bind(this);

		this.handleChangeValue = function (e) {
			let stateUpdate = {};
			stateUpdate[e.target.name] = e.target.value;
			this.setState(stateUpdate);
		}.bind(this);

		this.handleResetToSearch = function () {
			this.setState({ searchResults: [], hideSubMenu: false, selected: undefined });
		}.bind(this);

		this.toggleFavourite = async function (lon, lat, name, country) {
			let user = this.state.user;
			user.toggleFavourite(name, lon, lat, country);
			console.log(user.favourites);
			await UserManager.updateUser(user).then(res => {
				this.setState({ user: res });
			});
		}.bind(this);

		this.recordHistory = async function (result) {
			let user = this.state.user;
			user.recordHistory(result);
			await UserManager.updateUser(user).then(res => {
				this.setState({ user: res });
			});
		}.bind(this);

		this.setSelected = function (x) {
			this.showSearch();
			this.setState({ selected: x });
		}.bind(this);
		this.showSearch = function () {
			this.setState({ showingHistory: false, showingFavourites: false, showingSearch: true });
			this.handleResetToSearch();
		}.bind(this);
		this.showFavourites = function () {
			this.setState({ showingHistory: false, showingFavourites: true, showingSearch: false });
			this.handleResetToSearch();
		}.bind(this);
		this.showHistory = function () {
			this.setState({ showingHistory: true, showingFavourites: false, showingSearch: false });
			this.handleResetToSearch();
		}.bind(this);
	}

	render() {
		return <div className="justify-self-center">
			<Card className="mb-2">
				<div className="grid place-items-center p-5">
					<h1 className="text-3xl">Welcome {this.state.user.name}</h1>
				</div>
			</Card>
			{!this.state.hideSubMenu &&
				<Card className="mb-2">
					<div className="grid grid-cols-2 gap-x-20 p-5">
						{(this.state.showingHistory || this.state.showingFavourites) &&
							<button className="bg-teal-500 rounded p-5" onClick={this.showSearch}>
								Search
							</button>
						}
						{(this.state.showingHistory || this.state.showingSearch) &&
							<button className="bg-teal-500 rounded p-5" onClick={this.showFavourites}>
								Favourites
							</button>
						}
						{!this.state.showingHistory &&
							<button className="bg-teal-500 rounded p-5" onClick={this.showHistory}>
								History
							</button>
						}
					</div>
				</Card>
			}
			<Card className="mb-2">
				<div className="grid place-items-center px-5 py-2">
					{this.state.showingSearch ? "Searching" : ""}
					{this.state.showingFavourites ? "Viewing Favourites" : ""}
					{this.state.showingHistory ? "Viewing History" : ""}
				</div>
			</Card>
			{this.state.showingSearch && this.state.searchResults.length === 0 && !this.state.selected &&
				<Card secondaryCard>
					<form className="grid place-items-center p-5" onSubmit={this.onSubmit}>
						<label htmlFor="searchTerm">New search</label>
						<input name="searchTerm" type="textbox" className="text-black" onChange={this.handleChangeValue} ></input>
						<button className="mt-5 bg-teal-300 rounded p-2 text-slate-900 font-bold">Submit</button>
					</form>
				</Card>
			}
			{this.state.showingSearch && (this.state.searchResults.length > 0 || this.state.selected) &&
				<div className='grid grid-cols-1 place-items-center divide-y'>
					<Results recordHistory={this.recordHistory} results={this.state.searchResults} reset={this.handleResetToSearch} selected={this.state.selected} favourites={this.state.user.favourites} update={this.toggleFavourite}> </Results>
				</div>
			}
			{this.state.showingHistory && this.state.user.recentlyViewed.length > 0 &&
				<>
					{this.state.user.recentlyViewed.map((x, i) => (
						<Card key={i} className="mb-2" secondaryCard>
							<div className="grid place-items-center p-5" onClick={() => this.setState({ selected: x })}>
								<h1 className="text-3xl">{x.name} {"("}{x.country}{")"}</h1>
							</div>
						</Card>
					))}
				</>
			}
			{this.state.showingFavourites && this.state.user.favourites.length > 0 &&
				<>
					{this.state.user.favourites.map((x, i) => (
						<Card key={i} className="mb-2" secondaryCard>
							<div className="grid place-items-center p-5" onClick={() => { this.setSelected(x); }}>
								<h1 className="text-3xl">{x.name}
									{x.country ? "(" + x.country + ")" : ""}
								</h1>
							</div>
						</Card>
					))}
				</>
			}
			{this.state.showingFavourites && this.state.user.favourites.length === 0 &&
				<Card secondaryCard className="p-5">
					<p className='text-2xl'>No favourites found</p>
				</Card>
			}
		</div>;
	};
}
