const messenger = require('botlib').botMessenger('fb')
module.exports = async (customerId, profile) => {
	return ({
		id: customerId,
		name: profile ? profile.first_name : "Face Book User",
		action: '',
		searchText: {},
		zipcode: null,
		profile: profile
	})
}
