const messenger = require('botlib').botMessenger('fb')
const otp = require('botlib').otp
const config = require('./config')
const jsont = require('mustache')
const joi = require('joi')
const moment = require('moment');
const ABOUT = require('./action-templates/about.json')
const CHAT = require('./action-templates/chat.json')
const CONTACT = require('./action-templates/contact.json')
const CONFIRMATION = require('./action-templates/confirmation.json')
const GET_STARTED = require('./action-templates/get-started.json')
const LOCATION = require('./action-templates/location.json')
const MAIN_MENU = require('./action-templates/main-menu.json')
const MENU_CARDS = require('./action-templates/menu-cards.json')
const RESERVATION_COUNT = require('./action-templates/reservation-count.json')
const RESERVATION_DATE = require('./action-templates/reservation-date.json')
const RESERVATION = require('./action-templates/reservation.json')
const RESERVE_LUNCH = require('./action-templates/reserve-lunch.json')
const RESERVE_DINNER = require('./action-templates/reserve-dinner.json')
const START = require('./action-templates/start.json')
const TEXT_TEMPLATE = require('./action-templates/text-template.json')
const WELCOME_IMAGE = require('./action-templates/welcome-image.json')

const phoneSchema = {
	phone: joi.number().positive().min(1000000000).max(99999999999).required()
};

const otpSchema = {
	otp: joi.number().positive().min(0000).max(9999).required()
};

// const dialogflowAction = require('./dialogflow-action')

module.exports = (customer, action, intent, payload) => {
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
			// messenger.sendTextMessage(getTemplateRespone(START, { id: customer.id, name: customer.name }))
			// 	.then(() => messenger.sendListMessage(getTemplateRespone(MAIN_MENU, { id: customer.id })))
			customer.action = "GET_PHONE_NO"
			messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.RESERVATION_YES })
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
			messenger.sendGenericMessage(getTemplateRespone(CONTACT, { id: customer.id }))
			break

		case "RESERVATION":
			messenger.sendQuickRepliesMessage(getTemplateRespone(RESERVATION, { id: customer.id }))
			break

		case "RESERVATION_COUNT_UNKNOWN":
			messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.RESERVATION_COUNT_UNKNOWN })
			break

		case "RESERVATION_COUNT":
			customer.reservationCount = messageText
			messenger.sendTextMessage({ id: customer.id, text: `${messageText} of ya'll, Awesome! 😃` })
				.then(() => messenger.sendQuickRepliesMessage(getTemplateRespone(RESERVATION_COUNT, { id: customer.id })))
			break

		case "RESERVATION_CUSTOM_DATE":
			customer.action = "GET_CUSTOM_DATE"
			messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.RESERVATION_CUSTOM_DATE })
			break

		case "RESERVATION_DATE":
			customer.reservationDate = messageText.toLowerCase() === "tomorrow" ? moment().add(1, 'days').format('DD-MM-YYYY') : moment().format('DD-MM-YYYY')
			messenger.sendQuickRepliesMessage(getTemplateRespone(RESERVATION_DATE, { id: customer.id }))
			break

		case "RESERVATION_CANCEL":
			messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.RESERVATION_CANCEL })
			break

		case "RESERVE_LUNCH":
			messenger.sendQuickRepliesMessage(getTemplateRespone(RESERVE_LUNCH, { id: customer.id }))
			break

		case "RESERVE_DINNER":
			messenger.sendQuickRepliesMessage(getTemplateRespone(RESERVE_DINNER, { id: customer.id }))
			break

		case "RESERVE_TIME":
			customer.reservationTime = payload.split('|')[1]
			customer.notesOfReservation = "No. of People - " + customer.reservationCount + "." + " \nBooking Date & Time : " + customer.reservationDate + " - " + payload.split('|')[1];
			messenger.sendQuickRepliesMessage(getTemplateRespone(CONFIRMATION, { id: customer.id }))
			break

		case "RESERVATION_YES":
			customer.action = "GET_PHONE_NO"
			messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.RESERVATION_YES })
			break

		case "RESERVATION_NO":
			messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.RESERVATION_CANCEL })
			break

		case "GET_PHONE_NO":
			customer.action = ""
			const { error, value } = joi.validate({ phone: messageText }, phoneSchema);
			if (error) return messenger.sendTextMessage({ id: customer.id, text: "Phone number is not valid" + error })

			customer.action = "GET_OTP"
			customer.phone = messageText
			otp.send(customer.phone)
			.then(otpNumber => {
				otpNumber ? messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.ENTER_OTP })
					: messenger.sendTextMessage({ id: customer.id, text: 'Please try after some time' })
			})
			break

		case "GET_OTP":
			customer.action = "START"
			const { error: error1, value: value2 } = joi.validate({ otp: messageText }, otpSchema);
			if (error1) return messenger.sendTextMessage({ id: customer.id, text: "OTP is not valid" + error1 })

			// console.log('value ', value)
			// return messenger.sendTextMessage({ id: customer.id, text: "Phone number is valid" })

			otp.verify(customer.phone, messageText)
			.then(otpNumber => {
				otpNumber ? messenger.sendTextMessage({ id: customer.id, text: "OTP verified" })
					: messenger.sendTextMessage({ id: customer.id, text: 'Please try after some time' })
			})
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