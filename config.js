const Config = require('botlib').Config

module.exports = class config extends Config {
	static getAssetUrl() {
		return process.env.ASSET_URL
	}
}