const config = require('./config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const BotRouter = require('botlib').BotRouter
const botRouter = new BotRouter()
botRouter.init()
const processMessage = require('./process-message')
const processPostback = require('./process-postback')

app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/', botRouter.getRouter())

botRouter.on('botMessage', (messaging) => {
	processMessage(messaging)
})

botRouter.on('botPostBack', (messaging) => {
	processPostback(messaging)
})

app.listen(config.getPort(), () => console.log(`${config.getBotName()} is listening on port ${config.getPort()}`))
