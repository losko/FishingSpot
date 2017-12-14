const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const config = require('../config/database')

const ObjectId = mongoose.Schema.Types.ObjectId

// User Schema
const UseSchema = mongoose.Schema({
	name: {type: String},
	username: {type: String, required: true, unique: true},
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	roles: [],
	markers: [{type: ObjectId, ref: 'Marker'}],
	/*comments: [{type: ObjectId, ref: 'Comment'}]*/
})

const User = module.exports = mongoose.model('User', UseSchema)

module.exports.getUserById = function (id, callback) {
	User.findById(id, callback)
}

module.exports.getUserByUsername = function (username, callback) {
	const query = {username: username}
	User.findOne(query, callback)
}

module.exports.addUser = function (newUser, callback) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if(err) {
				return
			}
			newUser.password = hash
			newUser.save(callback)
		})
	})
}

module.exports.seedAdminUser = async () => {
	try {
		let users = await User.find()
		if (users.length > 0)  return console.log('Admin Exist')
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash('PaR0laA9m1n', salt, (err, hash) => {
				if(err) {
					return
				}
				return User.create({
					name: 'Name-Admin',
					username: 'Admin',
					email: 'Admin@abv.bg',
					password: hash,
					roles: ['Admin']
				})
			})
		})
	} catch (e) {
		console.log(e)
	}
}

module.exports.comparePasswrod = function (candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if(err) {
			throw err
		}
		callback(null, isMatch)
	})
}