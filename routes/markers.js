const express = require('express')
const router = express.Router()
const config = require('../config/database')
const Marker = require('../models/Marker')
const User = require('../models/User')

// Create
router.post('/create', (req, res, next) => {
	const newMarker = new Marker({
		name: req.body.name,
		info: req.body.info,
		lat: req.body.lat,
		lng: req.body.lng,
		author: req.body.user,
		draggable: true,
		editName: false,
		editInfo: false,
		privacy: true
	})
	Marker.addMarker(newMarker, (err, marker) => {
		if(err) {
			res.json({success: false, msg: 'Fail to Create Marker'})
		} else {
			if(newMarker) {
				User.findById({"_id": req.body.user}).then(user => {
					user.markers.push(newMarker);
					user.save();
					res.json({success: true, msg: 'Marker Created Success'})
				})
			}
		}
	})
})

// Get all markers by type
router.get('/getAll', (req, res, next) => {
	Marker.find().populate('author').then(markers => {
		if(markers) {
			res.json({success: true, msg: 'Markers get correctly', markers: markers})
		} else {
			res.json({success: false, msg: 'No markers found'})
		}
	})
})

router.get('/getAllPublic', (req, res, next) => {
	Marker.find({privacy: false}).populate('author').then(markers => {
		if(markers) {
			res.json({success: true, msg: 'Markers get correctly', markers: markers})
		} else {
			res.json({success: false, msg: 'No markers found'})
		}
	})
})

router.get('/getAllPrivate', (req, res, next) => {
	Marker.find({privacy: true}).populate('author').then(markers => {
		if(markers) {
			res.json({success: true, msg: 'Markers get correctly', markers: markers})
		} else {
			res.json({success: false, msg: 'No markers found'})
		}
	})
})

// Update marker
router.post('/updateName/:id', (req, res) => {
	Marker.findOneAndUpdate({_id: req.body._id}, {$set:{name: req.body.name} }, {new: true}, (err, marker) => {
		if(err) {
			return console.log(err)
		} else {
			res.json({success: true, msg: 'Markers Name Updated!', marker: marker})
		}
	})
})

router.post('/updateInfo/:id', (req, res) => {
	Marker.findOneAndUpdate({_id: req.body._id}, {$set:{info: req.body.info} }, {new: true}, (err, marker) => {
		if(err) {
			return console.log(err)
		} else {
			res.json({success: true, msg: 'Markers Info Updated!', marker: marker})
		}
	})
})

router.post('/updatePosition/:id', (req, res) => {
	Marker.findOneAndUpdate({_id: req.body._id}, {$set:{lat: req.body.lat, lng: req.body.lng} }, {new: true}, (err, marker) => {
		if(err) {
			return console.log(err)
		} else {
			res.json({success: true, msg: 'Markers Info Updated!', marker: marker})
		}
	})
})

router.post('/updatePrivacy/:id', (req, res) => {
	Marker.findOneAndUpdate({_id: req.body._id}, {$set:{privacy: req.body.privacy} }, {new: true}, (err, marker) => {
		if(err) {
			return console.log(err)
		} else {
			res.json({success: true, msg: 'Markers Info Updated!', marker: marker})
		}
	})
})

router.post('/updateDraggable/:id', (req, res) => {
	Marker.findOneAndUpdate({_id: req.body._id}, {$set:{draggable: req.body.draggable} }, {new: true}, (err, marker) => {
		if(err) {
			return console.log(err)
		} else {
			res.json({success: true, msg: 'Markers Info Updated!', marker: marker})
		}
	})
})


module.exports = router