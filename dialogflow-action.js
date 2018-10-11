const dialogflow = require('botlib').DialogFlow
const messenger = require('botlib').botMessenger('fb')
const action = require('./action')
const TEXT_TEMPLATE = require('./action-templates/text-template.json')

module.exports = (customer, messageText) => {

  function directions(responseText) {
    if ((responseText == "Anna Nagar") || (responseText == "AnnaNagar") || (responseText == "annanagar") || (responseText == "anna nagar")) {
      messenger.sendTextMessage({ id: customer.id, text: "https://www.google.com/maps/search/?api=1&query=AnnaNagarSeashell" })
    } else if ((responseText == "Egmore") || (responseText == "egmore") || (responseText == "eggmore") || (responseText == "egmor")) {
      messenger.sendTextMessage({ id: customer.id, text: "https://www.google.com/maps/search/?api=1&query=EgmoreSeashell" })
    } else if ((responseText == "Thuraipakkam") || (responseText == "Thorpakkam") || (responseText == "thoraipakkam") || (responseText == "thuraipakam") || (responseText == "thuraipakam")) {
      messenger.sendTextMessage({ id: customer.id, text: "https://www.google.com/maps/search/?api=1&query=ThuraipakkamSeashell" })
    } else if ((responseText == "Velachery") || (responseText == "velachery") || (responseText == "velacherry") || (responseText == "Velacherry")) {
      messenger.sendTextMessage({ id: customer.id, text: "https://www.google.com/maps/search/?api=1&query=VelacherySeashell" })
    } else if ((responseText == "Okkiyampet") || (responseText == "okkiyampet") || (responseText == "okiyampet")) {
      messenger.sendTextMessage({ id: customer.id, text: "https://www.google.com/maps/search/?api=1&query=OkkiyampetSeashell" })
    } else if ((responseText == "Perungudi") || (responseText == "perungudi") || (responseText == "perungudi")) {
      messenger.sendTextMessage({ id: customer.id, text: "https://www.google.com/maps/search/?api=1&query=PerungudiSeashell" })
    } else {
      messenger.sendTextMessage({ id: customer.id, text: "https://www.google.com/maps/search/?api=1&query=SeashellChennai" })
    }
  }
  return dialogflow(customer.id, messageText)
    .then(dialogResults => {
      const dialogResult = dialogResults[0].queryResult;
      let responseText = dialogResult.fulfillmentText;
      let messages = dialogResult.fulfillmentMessages;
      let dialogAction = dialogResult.action;
      let contexts = dialogResult.outputContexts;
      let parameters = dialogResult.parameters;

      if (dialogResult.intent) {
        let { displayName } = dialogResult.intent
        console.log('displayName ', displayName)

        switch (displayName.toLowerCase()) {
          case "directions":
            directions(responseText)
            break
          case "menu":
            action("MENU_CARDS", customer, messageText)
            break
          case "location":
            messenger.sendTextMessage({ id: customer.id, text: TEXT_TEMPLATE.LOCATION })
            break
          case "greet":
          case "business_hours":
          case "contact":
          case "about-sea shell":
          case "about-bot":
            messenger.sendTextMessage({ id: customer.id, text: responseText })
            break
          default:
            action("UNKNOWN", customer, messageText)
        }
      } else {
        action("UNKNOWN", customer, messageText)
      }
    })
}