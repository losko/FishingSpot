const express = require('express')
const router = express.Router()
const config = require('../config/database')
const Marker = require('../models/Marker')
const User = require('../models/User')

// Get all markers by type
router.get('/getAllMarkers', (req, res, next) => {
	Marker.find().populate('author').then(markers => {
		if(markers) {
			res.json({success: true, msg: 'Markers get correctly', markers: markers})
		} else {
			res.json({success: false, msg: 'No markers found'})
		}
	})
})

router.get('/getAllPublicMarkers', (req, res, next) => {
	Marker.find({privacy: false}).populate('author').then(markers => {
		if(markers) {
			res.json({success: true, msg: 'Markers get correctly', markers: markers})
		} else {
			res.json({success: false, msg: 'No markers found'})
		}
	})
})

router.get('/getAllPrivateMarkers', (req, res, next) => {
	Marker.find({privacy: true}).populate('author').then(markers => {
		if(markers) {
			res.json({success: true, msg: 'Markers get correctly', markers: markers})
		} else {
			res.json({success: false, msg: 'No markers found'})
		}
	})
})

// Update marker
router.post('/updateMarkerName/:id', (req, res) => {
	Marker.findOneAndUpdate({_id: req.body._id}, {$set:{name: req.body.name} }, {new: true}, (err, marker) => {
		if(err) {
			return console.log(err)
		} else {
			res.json({success: true, msg: 'Markers Name Updated!', marker: marker})
		}
	})
})

router.post('/updateMarkerInfo/:id', (req, res) => {
	Marker.findOneAndUpdate({_id: req.body._id}, {$set:{info: req.body.info} }, {new: true}, (err, marker) => {
		if(err) {
			return console.log(err)
		} else {
			res.json({success: true, msg: 'Markers Info Updated!', marker: marker})
		}
	})
})

router.post('/updateMarkerPosition/:id', (req, res) => {
	Marker.findOneAndUpdate({_id: req.body._id}, {$set:{lat: req.body.lat, lng: req.body.lng} }, {new: true}, (err, marker) => {
		if(err) {
			return console.log(err)
		} else {
			res.json({success: true, msg: 'Markers Info Updated!', marker: marker})
		}
	})
})

router.post('/updateMarkerPrivacy/:id', (req, res) => {
	Marker.findOneAndUpdate({_id: req.body._id}, {$set:{privacy: req.body.privacy} }, {new: true}, (err, marker) => {
		if(err) {
			return console.log(err)
		} else {
			res.json({success: true, msg: 'Markers Info Updated!', marker: marker})
		}
	})
})

router.post('/updateMarkerDraggable/:id', (req, res) => {
	Marker.findOneAndUpdate({_id: req.body._id}, {$set:{draggable: req.body.draggable} }, {new: true}, (err, marker) => {
		if(err) {
			return console.log(err)
		} else {
			res.json({success: true, msg: 'Markers Info Updated!', marker: marker})
		}
	})
})

router.post('/deleteMarker/:id', (req, res) => {
	const user = req.body.author._id
	User.findById({_id: user}).populate('markers').then(user => {
		if(user) {
			user.markers.remove(req.body._id)
			user.save()
			Marker.findOneAndRemove({_id: req.body._id}, (err, marker) => {
				let markers = user.markers
				if(err) {
					return console.log(err)
				} else {
					res.json({success: true, msg: 'Markers Info Updated!', markers: markers})
				}
			})
		} else {
			console.log('User not found')
		}
	})
})
// get all users
router.get('/getAllUsers', (req, res) =>{
	User.find().populate('markers').then(users => {
		res.json({success: true, msg: 'Users Found', users: users})
	})
})

// get user by id
router.get('/getUserById/:id', (req, res) =>{
	let userId = req.query.id
	User.findById(userId).then(user => {
		res.json({success: true, msg: 'Users Found', user: user})
	})
})

// Edit user
router.post('/editUser/:id', (req, res) => {
	const userId = req.body.id
	const name = req.body.name
	const username = req.body.username
	const email = req.body.email
	console.log(userId)
	User.findOneAndUpdate({_id: userId}, {$set:{name: name, username: username, email: email} }, {new: true}, (err, user) => {
		if(err) {
			return console.log(err)
		} else {
			res.json({success: true, msg: 'User Edited', user: user})
		}
	})
})

// delete user by id
router.post('/deleteUser/:id', (req, res) => {
	const userId = req.body._id
	User.findOneAndRemove({_id: userId}).then((user) => {
		if(user) {
			Marker.find().remove({author: {$in: user}}, (err) => {
				if(err) {
					res.json({success: false, msg: 'Users Not Found'})
				} else {
					res.json({success: true, msg: 'Users Deleted'})
				}
			})
		} else {
			res.json({success: false, msg: 'Users Not Found'})
		}
	})
})
// Make user admin
router.post('/makeAdmin/:id', (req, res) => {
	const userId = req.body._id
	User.findById({_id: userId}).then((user) => {
		if(user) {
			user.roles.push('Admin')
			user.save()
			res.json({success: true, msg: 'Users Promoted', user: user})
		} else {
			res.json({success: false, msg: 'Users Not Found'})
		}
	})
})
// Make user a normal user
router.post('/makeNormal/:id', (req, res) => {
	const userId = req.body._id
	User.findById({_id: userId}).then((user) => {
		if(user) {
			user.roles.shift()
			user.save()
			res.json({success: true, msg: 'Users Demoted', user: user})
		} else {
			res.json({success: false, msg: 'Users Not Found'})
		}
	})
})

module.exports = router