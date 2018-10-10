const messenger = require('botlib').botMessenger('fb')
const YaliService = require('botlib').YaliService
const yaliService = new YaliService()
const businessId = 11
module.exports = async (customerId, profile) => {
	yaliService.addBusinessCustomer(businessId, customerId, profile)
	return ({
		id: customerId,
		name: profile ? profile.first_name : "Face Book User",
		action: '',
		searchText: {},
		reservationDate: null,
		reservationTime: null,
		reservationCount: 0,
		notesOfReservation: {},
		feedback: {},
		phone: null,
		profile: profile,
		businessId
	})
}
