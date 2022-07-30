function getJson(req) {
	if (req.status !== 200) {
		//TODO: implement generic global error handler
		//possibly create something where i can just throw an event and handle else where not in the services
		return {};
	} else {
		return req.json();
	}
}

const weatherApiService = {
	search: (query) => {
		const body = JSON.stringify({ search: query });
		return fetch('/api/search_weather', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: body
		}).then(getJson)
			.catch((err) => {
				//TODO: implement generic global error handler
				//possibly create something where i can just throw an event and handle else where not in the services
			});
	}
};

export default weatherApiService;