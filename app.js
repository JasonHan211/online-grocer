if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const app = express()
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require("passport")
const methodOverride = require('method-override')
const mqtt = require('mqtt')

//Passport config
require('./config/passport')(passport)

//MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err)=> console.log(err))

//MQTT
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`
app.locals.mqttClient = mqtt.connect(connectUrl, {
    clientId: clientId,
    clean: true,
    connectTimeout: 30 * 1000,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    reconnectPeriod: 1000,
    protocolId: 'MQTT',
    protocolVersion: 4,
})

const mqttClient = app.locals.mqttClient

const topic = [
    'packaging/queue'
]
mqttClient.on('connect', () => {

  console.log('Connected to MQTT: ',`mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`)

  mqttClient.subscribe(topic, () => {
    console.log(`Subscribe to topic '${topic}'`)
  })

})
mqttClient.on('error', (err) => {
    console.log('MQTT-Error: ',err);
    mqttClient.end();
})

mqttClient.on('message', (topic, payload) => {
  // console.log('Received Message:', topic, payload.toString())
})

//EJS
app.set('view engine','ejs')
app.use(expressEjsLayout)
app.set('layout', '../views/layouts/auth')
app.use(express.static(__dirname + '/public/'))
app.use(methodOverride('_method'))

//BodyParser
app.use(express.json())
app.use(express.urlencoded({extended : false}))

//Express session
app.use(session({
    secret : process.env.SESSION_SECRET || 'keyboard cat',
    resave : false,
    saveUninitialized : false,
    rolling: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 1 * 24 * 60 * 60
      })
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error  = req.flash('error')
    next()
    })
    
//Routes
app.use('/',require('./routes/index'))
app.use('/admin',require('./routes/admin'))
app.use('/item',require('./routes/item'))
app.use('/api',require('./api/index'))
app.use('/users',require('./routes/users'))
app.use('/shopping',require('./routes/shopping'))

app.listen(process.env.PORT || 3000)