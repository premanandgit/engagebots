const CustomerSession = require('botlib').customerSession
const customerSession = new CustomerSession()
const createCustomer = require('./customer')
const YaliNLP = require('botlib').YaliNLP
const yaliNLP = new YaliNLP()
const action = require('./action')

module.exports = (intent) => {
  try {
    console.log('Sender ', intent.sender.id)
    return customerSession.create(intent.sender.id, createCustomer)
    .then(customer => {
      if(!customer) {
        console.log("Error: Customer session is null", customer)
        return;
      } 
      let message = intent.message;

      if (message.quick_reply) {
        if (message.quick_reply.payload) {
          action(customer, message.quick_reply.payload.split('|')[0], intent, message.quick_reply.payload)
        }
      }
      else if (message.text) {
        if (yaliNLP.hasGreet(message.text)) {
          action(customer, "START", intent)
        } else {
          action(customer, customer.action, intent)
        }
      }
    })
  } catch (error) {
    console.log("Error while processing message ", error)
    return null
  }

}