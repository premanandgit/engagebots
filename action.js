const messenger = require('botlib').botMessenger('fb')
const otp = require('botlib').otp
const YaliService = require('botlib').YaliService
const yaliService = new YaliService()
const config = require('./config')
const jsont = require('mustache')
const joi = require('joi')
const moment = require('moment');
const ABOUT = require('./action-templates/about.json')
const ADD_MENU = require('./action-templates/add-menu.json')
const UNKNOWN = require('./action-templates/unknown.json')
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

const reservationCountSchema = {
	count: joi.number().positive().min(9).max(100).required()
};

const reservationDateSchema = {
	date: joi.date().min(moment().format('DD-MM-YYYY')).required()
};

module.exports = (action, customer, message) => {
	let messageText = message.split('|')[0]
	console.log('messageText ', messageText)
	console.log('action ', action)
	console.log('customer ', customer)

	function get_started() {
		messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.GET_STARTED })
			.then(() => messenger.sendImageMessage(getTemplateRespone(WELCOME_IMAGE, { id: customer.id, url: config.getAssetUrl() })))
			.then(() => messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.BOT_INFO }))
			.then(() => messenger.sendListMessage(getTemplateRespone(MAIN_MENU, { id: customer.id })))
	}

	function menu_cards() {
		messenger.sendImageMessage({ id: customer.id, url: `${config.getAssetUrl()}/65/1.jpg` })
			.then(() => messenger.sendImageMessage({ id: customer.id, url: `${config.getAssetUrl()}/65/2.jpg` }))
			.then(() => messenger.sendImageMessage({ id: customer.id, url: `${config.getAssetUrl()}/65/3.jpg` }))
			.then(() => messenger.sendImageMessage({ id: customer.id, url: `${config.getAssetUrl()}/65/4.jpg` }))
			.then(() => messenger.sendImageMessage({ id: customer.id, url: `${config.getAssetUrl()}/65/5.jpg` }))
			.then(() => messenger.sendQuickRepliesMessage(getTemplateRespone(MENU_CARDS, { id: customer.id })))
	}

	function contact() {
		messenger.sendGenericMessage(getTemplateRespone(CONTACT, { id: customer.id }))
	}

	function location() {
		messenger.sendGenericMessage(getTemplateRespone(LOCATION, { id: customer.id }))
	}

	function unknown() {
		let templateJson = JSON.parse(jsont.render(JSON.stringify(UNKNOWN), { id: customer.id }))
		return messenger.sendTextMessage(templateJson.response)
	}

	function getTemplate(name, data) {
		return JSON.parse(jsont.render(JSON.stringify(name), data))
	}

	function getTemplateRespone(name, data) {
		return getTemplate(name, data).response
	}

	function resetCustomer() {
		customer.action = ''
		customer.searchText = {}
		customer.reservationDate = null
		customer.reservationTime = null
		customer.reservationCount = 0
		customer.notesOfReservation = {}
		customer.phone = null
	}

	function doAction(action) {
		switch (action) {
			case "addmenu":
				messenger.addPersistentMenu(ADD_MENU)
				break

			case "removemenu":
				messenger.setPersistentMenu({ pageId: 'me', menuItems: [] })
				break

			case "GET_STARTED":
				get_started()
				break

			case "START":
				messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.START })
					.then(() => messenger.sendListMessage(getTemplateRespone(MAIN_MENU, { id: customer.id })))
				break

			case "ABOUT":
				messenger.sendQuickRepliesMessage(getTemplateRespone(ABOUT, { id: customer.id }))
				break

			case "MAIN_MENU":
				messenger.sendListMessage(getTemplateRespone(MAIN_MENU, { id: customer.id }))
				break

			case "PROMOTIONS":
				messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.PROMOTIONS })
				break

			case "LOCATION":
				location()
				break

			case "MENU_CARDS":
				menu_cards()
				break

			case "CONTACT":
				contact()
				break

			case "RESERVATION":
				messenger.sendQuickRepliesMessage(getTemplateRespone(RESERVATION, { id: customer.id }))
				break

			case "RESERVATION_COUNT_UNKNOWN":
				customer.action = "GET_RESERVATION_COUNT"
				messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.RESERVATION_COUNT_UNKNOWN })
				break

			case "RESERVATION_COUNT":
				customer.reservationCount = message.split('|')[1]
				messenger.sendTextMessage({ id: customer.id, text: `${customer.reservationCount} of ya'll, Awesome! 😃` })
					.then(() => messenger.sendQuickRepliesMessage(getTemplateRespone(RESERVATION_COUNT, { id: customer.id })))
				break

			case "GET_RESERVATION_COUNT":
				const { error: countError } = joi.validate({ count: messageText }, reservationCountSchema);
				if (countError) {
					messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.RESERVATION_COUNT_INVALID })
				} else {
					customer.reservationCount = messageText
					messenger.sendTextMessage({ id: customer.id, text: `${messageText} of ya'll, Awesome! 😃` })
						.then(() => messenger.sendQuickRepliesMessage(getTemplateRespone(RESERVATION_COUNT, { id: customer.id })))
				}
				break

			case "RESERVATION_CUSTOM_DATE":
				customer.action = "GET_CUSTOM_DATE"
				messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.RESERVATION_CUSTOM_DATE })
				break

			case "RESERVATION_DATE":
				customer.reservationDate = message.split('|')[1] === "TOMORROW" ? moment().add(1, 'days').format('DD-MM-YYYY') : moment().format('DD-MM-YYYY')
				messenger.sendQuickRepliesMessage(getTemplateRespone(RESERVATION_DATE, { id: customer.id }))
				break

			case "GET_CUSTOM_DATE":
				if (moment(Date.parse(messageText)).isValid()) {
					let reservationDate = moment(Date.parse(messageText)).format('DD-MM-YYYY')

					const { error: dateError } = joi.validate({ date: reservationDate }, reservationDateSchema);
					if (dateError) {
						messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.INVALID_DATE })
					} else {
						customer.reservationDate = reservationDate
						messenger.sendQuickRepliesMessage(getTemplateRespone(RESERVATION_DATE, { id: customer.id }))
					}
				}
				else {
					messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.INVALID_DATE })
				}
				break

			case "RESERVATION_CANCEL":
				resetCustomer()
				messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.RESERVATION_CANCEL })
				break

			case "RESERVE_LUNCH":
				messenger.sendQuickRepliesMessage(getTemplateRespone(RESERVE_LUNCH, { id: customer.id }))
				break

			case "RESERVE_DINNER":
				messenger.sendQuickRepliesMessage(getTemplateRespone(RESERVE_DINNER, { id: customer.id }))
				break

			case "RESERVE_TIME":
				customer.reservationTime = message.split('|')[1]
				customer.notesOfReservation = "No. of People - " + customer.reservationCount + "." + " \nBooking Date & Time : " + customer.reservationDate + " - " + message.split('|')[1];
				messenger.sendQuickRepliesMessage(getTemplateRespone(CONFIRMATION, { id: customer.id }))
				break

			case "RESERVATION_YES":
				customer.action = "GET_PHONE_NO"
				messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.RESERVATION_YES })
				break

			case "RESERVATION_NO":
				resetCustomer()
				messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.RESERVATION_CANCEL })
				break

			case "GET_PHONE_NO":
				const { error, value } = joi.validate({ phone: messageText }, phoneSchema);
				if (error) {
					messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.INVALID_PHONE_NO })
				} else {
					customer.action = "GET_OTP"
					customer.phone = messageText
					otp.send(customer.phone)
						.then(otpNumber => {
							if (otpNumber) {
								messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.ENTER_OTP })
							} else {
								customer.action = "GET_PHONE_NO"
								messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.OTP_PROBLEM })
							}
						})
				}
				break

			case "GET_OTP":
				const { error: otpError } = joi.validate({ otp: messageText }, otpSchema);
				if (otpError) {
					messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.OTP_INVALID })
				} else {
					otp.verify(customer.phone, messageText)
						.then(otpNumber => {
							if (otpNumber) {
								yaliService.createReservation(customer)
									.then(() => {
										messenger.sendTextMessage({ id: customer.id, text: `Your Reservation for ${customer.reservationDate} at ${customer.reservationTime} is confirmed! .For any queries on your reservation , call us @+91-9444512152 Thank you.` })
										resetCustomer()
									})
							} else {
								messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.OTP_INVALID })
							}
						})
				}
				break

			case "FEEDBACK_REFERRAL":
				yaliService.createFeedback(customer)
				get_started()
				break

			// case "FEEDBACK":
			// 	customer.feedback.food = message.split('|')[1]
			// 	messenger.sendQuickRepliesMessage(getTemplateRespone(CONFIRMATION, { id: customer.id }))
			// 	break

			// case "FEEDBACK_SERVICE":
			// 	customer.feedback.service = message.split('|')[1]
			// 	messenger.sendQuickRepliesMessage(getTemplateRespone(CONFIRMATION, { id: customer.id }))
			// 	break

			// case "FEEDBACK_AMBIENCE":
			// 	customer.feedback.ambience = message.split('|')[1]
			// 	messenger.sendQuickRepliesMessage(getTemplateRespone(CONFIRMATION, { id: customer.id }))
			// 	break

			case "UNKNOWN":
				unknown().then(() => messenger.sendListMessage(getTemplateRespone(MAIN_MENU, { id: customer.id })))
				break

			case "CHATUS":
				messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.HANDOVER })
					.then(() => messenger.handOver({ id: customer.id }))
				break

			default:
				return true
		}
	}

	return doAction(action) ? true : null
}