const CustomerSession = require('botlib').customerSession
const customerSession = new CustomerSession();
const createCustomer = require('./customer')
const action = require('./action')

module.exports = (intent) => {
	try {
		console.log('Sender ', intent.sender.id)
		return customerSession.create(intent.sender.id, createCustomer)
		.then(customer => {
			if(!customer) {
        console.log("Error: Customer session is null")
        return;
			} 
			
			if(intent.postback.title === 'Get Started')
				action(customer, 'GET_STARTED', intent)
			else {
				let payload = intent.postback.payload;
				if (payload) {
					action(customer, payload, intent)
				}
			}	
		})
	} catch(error) {
		console.log("Error while processing postback message ", error)
		return null
	}
}