export default class User {
	constructor(options) {
		this.name = options && options.name || 'N/A';
		this.favourites = options && options.favourites || [];
		this.recentSearches = options && options.recentSearches || [];
	}

	addFavourite(location) {
		this.favourites.push(location);
	}
}