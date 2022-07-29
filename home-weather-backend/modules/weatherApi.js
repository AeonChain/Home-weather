//needs to be moved to env variable or secrets, but probs just put it in git for now so it's demoable
const apiKey = '40026008bc62d88f5ecf75db02b509b0';
const weatherApiUrl = 'http://api.openweathermap.org/';

module.exports = class Api {
	constructor(app) {
		function searchQuery(req, res) {
			const query = req.body.search || '';
			res.status(200).json(this.searchCities(query));
		}
		app.post('/search_weather', searchQuery.bind(this));

		this.cachedCitySearches = {};
		this.testingFailsafe = false;
	}

	searchCities(query) {
		if (query) {
			const lowerCaseQuery = (query + '').toLowerCase();
			const existingQuery = this.cachedCitySearches[lowerCaseQuery];
			console.log("existing query", lowerCaseQuery, existingQuery);
			if (!existingQuery || existingQuery.expiry < new Date()) {
				const cacheResult = function (result) {
					var date = new Date();
					date.setDate(date.getDate() + 1);
					const expiry = date;
					this.cachedCitySearches[lowerCaseQuery] = {
						results: result,
						expiry: expiry
					};
					console.log("current cached results:",
						this.cachedCitySearches);
					return this.cachedCitySearches[lowerCaseQuery];
				}.bind(this);
				return fetch(weatherApiUrl + `geo/1.0/direct?q=${lowerCaseQuery}&limit=5&appid=${apiKey}`)
					.then(res => res.json(JSON.parse))
					.then(res => {
						return res.map((x) => {
							return { name: x.name, state: x.state, country: x.country };
						});
					})
					.then(cacheResult);
			} else {
				console.log('using cached query');
				return existingQuery.results;
			}
		}
	}

	weatherForCity(lon, lat) {

	}
};