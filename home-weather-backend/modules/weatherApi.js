//needs to be moved to env variable or secrets, but probs just put it in git for now so it's demoable
const apiKey = '40026008bc62d88f5ecf75db02b509b0';
const weatherApiUrl = 'http://api.openweathermap.org/';

module.exports = class Api {
	constructor(app) {
		function clearCache(req, res) {
			//maybe just set all expiries? not sure what we'd use the soft deleted data for however
			console.log("clearing cache");
			this.cachedCitySearches = {};
			this.cachedDetailQueries = {};
			res.status(200).json({ message: "cacheCleared" });
		}

		app.post('/search_weather', async (req, res) => {
			console.log(this);
			const query = req.body.search || '';
			let response = this.searchCities(query);
			if (response.then) {
				response = await response;
			}
			res.status(200).json(response);
		});

		app.post('/detail', async (req, res) => {
			const lon = req.body.lon || '';
			const lat = req.body.lat || '';
			if (!lon || !lat) {
				//just return 400(bad request) as data isn't all there
				res.status(400);
			}
			let response = this.weatherForCity(lon, lat);
			if (response.then) {
				res.status(200).json(await response);
				response = await response;
				console.log('awaited', response);
			} else {
				res.status(200).json(response);
			}

		});

		app.get('/weather_clear_cache', clearCache.bind(this));

		this.cachedCitySearches = {};
		this.cachedDetailQueries = {};
		this.searchCities = this.searchCities;
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
					return this.cachedCitySearches[lowerCaseQuery].results;
				}.bind(this);
				return fetch(weatherApiUrl + `geo/1.0/direct?q=${lowerCaseQuery}&limit=5&appid=${apiKey}`)
					.then(res => res.json(JSON.parse))
					.then(res => {
						return res.map((x) => {
							return { name: x.name, state: x.state, country: x.country, lat: x.lat, lon: x.lon };
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
		const lowerCaseQuery = (lon + '_' + lat).toLowerCase();
		const existingQuery = this.cachedDetailQueries[lowerCaseQuery];
		console.log("existing detail query", lowerCaseQuery, existingQuery);
		if (!existingQuery || existingQuery.expiry < new Date()) {
			const cacheResult = function (result) {
				var date = new Date();
				//wind only update it after 10 minutes api doesn't specify how often updates go but 10 minutes should be enough probably add some text to explain this
				date.setMinutes(date.getMinutes() + 10);
				const expiry = date;
				this.cachedDetailQueries[lowerCaseQuery] = {
					//only interested in wind for now
					result: result,
					expiry: expiry
				};
				return this.cachedDetailQueries[lowerCaseQuery].result;
			}.bind(this);
			return fetch(weatherApiUrl + `/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
				.then(res => res.json(JSON.parse))
				.then(res => {
					return { id: res.id, wind: res.wind, name: res.name };
				})
				.then(cacheResult);
		} else {
			console.log('using cached query');
			return existingQuery.result;
		}
	}
};