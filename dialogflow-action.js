const dialogflow = require('botlib').DialogFlow
const messenger = require('botlib').botMessenger('fb')
const jsont = require('mustache')
const flowTemplates = require('./flow.json')

module.exports = (customer, messageText) => {
  return dialogflow(customer.id, messageText)
    .then(dialogResults => {
      const dialogResult = dialogResults[0].queryResult;
      let responseText = dialogResult.fulfillmentText;
      let messages = dialogResult.fulfillmentMessages;
      let action = dialogResult.action;
      let contexts = dialogResult.outputContexts;
      let parameters = dialogResult.parameters;

      if (dialogResult.intent) {
        let { displayName } = dialogResult.intent
        console.log('displayName ', displayName)

        switch (displayName.toLowerCase()) {
          case "recycle-items":
            console.log("responseText ", responseText)
            return ({ next: true, text: responseText})
          case "recycle-center":
          case "greet":
            messenger.sendTextMessage({ id: customer.id, text: responseText })
            return ({ next: null })
          default:
            return ({ next: true })
        }
      } else {
        return ({ next: true })
      }
    })
}