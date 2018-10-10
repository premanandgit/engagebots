const CustomerSession = require('botlib').customerSession
const customerSession = new CustomerSession()
const createCustomer = require('./customer')
const YaliNLP = require('botlib').YaliNLP
const yaliNLP = new YaliNLP()
const action = require('./action')
const dialogFlowAction = require('./dialogflow-action')

module.exports = (intent) => {
  try {
    console.log('Sender ', intent.sender.id)
    return customerSession.create(intent.sender.id, createCustomer)
      .then(customer => {
        if (!customer) {
          console.log("Error: Customer session is null", customer)
          return;
        }
        let message = intent.message;

        if (message.quick_reply) {
          if (message.quick_reply.payload) {
            console.log('message.quick_reply ', message.quick_reply)
            action(message.quick_reply.payload.split('|')[0], customer, message.quick_reply.payload)
          }
        }
        else if (message.text) {
          let yaliAction = yaliNLP.findAction(message.text)
          if (action(yaliAction || customer.action, customer, message.text))
            dialogFlowAction(customer, message.text)
        }
      })
  } catch (error) {
    console.log("Error while processing message ", error)
    return null
  }

}