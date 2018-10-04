const messenger = require('botlib').botMessenger('fb')
const config = require('./config')
const jsont = require('mustache')
const ABOUT = require('./action-templates/about.json')
const CHAT = require('./action-templates/chat.json')
const GET_STARTED = require('./action-templates/get-started.json')
const LOCATION = require('./action-templates/location.json')
const MAIN_MENU = require('./action-templates/main-menu.json')
const MENU_CARDS = require('./action-templates/menu-cards.json')
const START = require('./action-templates/start.json')
const WELCOME_IMAGE = require('./action-templates/welcome-image.json')
// const dialogflowAction = require('./dialogflow-action')

module.exports = (customer, action, intent) => {
	let { message } = intent
	let messageText = message ? message.text : null
	console.log('messageText ', messageText)
	console.log('action ', action)
	console.log('customer ', customer)

	// function callDialogFlow(shouldCheckRecycle) {
	// 	dialogflowAction(customer, customer.searchText)
	// 		.then(dialogResult => {
	// 			if (dialogResult.next && shouldCheckRecycle) {
	// 				// messenger.sendTextMessage({ id: customer.id, text: "Please wait, searching better result .." })
	// 				// recycle(dialogResult.text)
	// 			} else if (dialogResult.next) {
	// 				chat()
	// 			}
	// 		})
	// 		.catch(error => {
	// 			console.log("Error ", error)
	// 			chat()
	// 		})
	// }

	function chat() {
		let templateJson = JSON.parse(jsont.render(JSON.stringify(CHAT), { id: customer.id }))
		messenger.sendTextMessage(templateJson.response)
	}

	function getTemplate(name, data) {
		return JSON.parse(jsont.render(JSON.stringify(name), data))
	}

	function getTemplateRespone(name, data) {
		return getTemplate(name, data).response
	}

	switch (action) {
		case "GET_STARTED":
			messenger.sendTextMessage(getTemplateRespone(GET_STARTED, { id: customer.id, name: customer.name }))
			.then(() => messenger.sendImageMessage(getTemplateRespone(WELCOME_IMAGE, { id: customer.id, url: config.getAssetUrl() })))
			.then(() => messenger.sendListMessage(getTemplateRespone(MAIN_MENU, { id: customer.id })))
			break

		case "START":
			messenger.sendTextMessage(getTemplateRespone(START, { id: customer.id, name: customer.name }))
			.then(() => messenger.sendListMessage(getTemplateRespone(MAIN_MENU, { id: customer.id })))
			break

		case "ABOUT":
			messenger.sendQuickRepliesMessage(getTemplateRespone(ABOUT, { id: customer.id }))
			break

		case "MAIN_MENU":
			messenger.sendListMessage(getTemplateRespone(MAIN_MENU, { id: customer.id }))
			break
		
		case "LOCATION":
			messenger.sendGenericMessage(getTemplateRespone(LOCATION, { id: customer.id }))
			break	
		
		case "MENU_CARDS":
			messenger.sendImageMessage({ id: customer.id, url: `${config.getAssetUrl()}/65/1.jpg` })
			.then(() => messenger.sendImageMessage({ id: customer.id, url: `${config.getAssetUrl()}/65/2.jpg` }))
			.then(() => messenger.sendImageMessage({ id: customer.id, url: `${config.getAssetUrl()}/65/3.jpg` }))
			.then(() => messenger.sendImageMessage({ id: customer.id, url: `${config.getAssetUrl()}/65/4.jpg` }))
			.then(() => messenger.sendImageMessage({ id: customer.id, url: `${config.getAssetUrl()}/65/5.jpg` }))
			.then(() => messenger.sendQuickRepliesMessage(getTemplateRespone(MENU_CARDS, { id: customer.id })))
			break
		
		case "CONTACT":
			messenger.sendGenericMessage(getTemplateRespone(LOCATION, { id: customer.id }))
			break
		
		default:
			chat()

			// customer.searchText = messageText
			// if (customer.zipcode) {
			// 	callDialogFlow(true)
			// } else {
			// 	customer.action = ''
			// 	callDialogFlow()
			// }


		// let chat = JSON.parse(jsont.render(JSON.stringify(flowTemplates.CHAT), { id: customer.id, name: customer.name }))
		// customer.action = chat.nextAction
		// messenger.sendTextMessage(chat.response)
		// messenger.handOver({ id: customer.id })
		// 	.then(result => console.log('handover result', result))
	}
}