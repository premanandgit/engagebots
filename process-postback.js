const CustomerSession = require('botlib').customerSession
const customerSession = new CustomerSession();
const createCustomer = require('./customer')
const action = require('./action')

module.exports = (intent) => {
	try {
		console.log('Sender ', intent.sender.id)
		return customerSession.create(intent.sender.id, createCustomer)
			.then(customer => {
				if (!customer) {
					console.log("Error: Customer session is null")
					return;
				}

				let { postback } = intent
				let { referral } = postback
				console.log('referral ', referral)
				let payload = referral ? referral.ref : postback.payload
				if (payload) {
					action(payload.split('|')[0], customer, payload)
				}
			})
	} catch (error) {
		console.log("Error while processing postback message ", error)
		return null
	}
}