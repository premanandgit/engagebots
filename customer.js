const messenger = require('botlib').botMessenger('fb')
module.exports = async (customerId, profile) => {
	return ({
		id: customerId,
		name: profile ? profile.first_name : "Face Book User",
		action: '',
		searchText: {},
		reservationDate: null,
		reservationTime: null,
		reservationCount: 0,
		notesOfReservation: {},
		phone: null,
		profile: profile
	})
}
