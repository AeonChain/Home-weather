export default class User {
	constructor(options) {
		this.name = options && options.name || 'N/A';
		this.favourites = options && options.favourites || [];
		this.recentlyViewed = options && options.recentlyViewed || [];
	}

	toggleFavourite(name, lon, lat, country) {
		const key = lon + "_" + lat;
		const exists = this.findFavourite(key);
		if (exists >= 0) {
			this.favourites.splice(exists, 1);
		} else {
			this.favourites.push({ name: name, key: key, lon: lon, lat: lat, country: country });
		}
	}

	recordHistory(location) {
		if (this.recentlyViewed.length >= 5) {
			this.recentlyViewed.splice(4, 1);
		}
		this.recentlyViewed.push(location);
	}

	findFavourite(key) {
		return this.favourites.findIndex((x) => x.key === key);
	}
}