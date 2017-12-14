const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const User = require('./models/User')
const Marker = require('./models/Marker')
const MarkerDetails = require('./models/MarkerDetails')

// DB Setup
const mongoose = require('mongoose')
const config = require('./config/database')
mongoose.Promise = global.Promise
mongoose.connect(config.database, {
	useMongoClient: true
});

// On success connect to DB
mongoose.connection.on('connected', () => {
	User.seedAdminUser().then(() => {
		console.log('Admin seeded!')
	}).catch((reason) => {
		console.log(reason)
	})
	console.log('Connected to Database ' + config.database)
})

// On fail connect to DB
mongoose.connection.on('error', (error) => {
	console.log('Database Error ' + error)
})

const app = express()
const markerDetails = require('./routes/markerDetails')
const users = require('./routes/users')
const markers = require('./routes/markers')
const admin = require('./routes/admin')
const port = 3000
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())

app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

app.use('/markerDetails', markerDetails)
app.use('/users', users)
app.use('/markers', markers)
app.use('/admin', admin)

app.get('/', (req, res) => {
	res.send('Invalid Endpoint')
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.listen(port, () => {
	console.log('Server listen on port ' + port)
})