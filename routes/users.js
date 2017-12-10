const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../config/database')
const User = require('../models/User')

// Register
router.post('/register', (req, res, next) => {
	const newUser = new User({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		password: req.body.password
	})
	User.addUser(newUser, (err, user) => {
		if(err) {
			res.json({success: false, msg: 'Fail to Registered'})
		} else {
			res.json({success: true, msg: 'User Registered'})
		}
	})
})

// Authenticate
router.post('/authenticate', (req, res, next) => {
	const username = req.body.username
	const password = req.body.password

	User.getUserByUsername(username, (err, user) => {
		if(err) {
			throw err
		}
		if(!user) {
			return res.json({success: false, msg: 'User not found'})
		}

		User.comparePasswrod(password, user.password, (err, isMatch) => {
			if(err) {
				throw err
			}
			if(isMatch) {
				const token = jwt.sign({user: user}, config.secret)

				res.json({
					success: true,
					token: 'JWT ' + token,
					user: {
						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email
					}
				})
			} else {
				return res.json({success: false, msg: 'Invalid Username or Password'})
			}
		})
	})
})

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	User.find(req.user._id).populate('markers').then(user => {
		req.user.markers = user.markers
		res.json({user: user})
	})
})


module.exports = router