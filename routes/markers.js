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
		private: true
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
	Marker.find().then(markers => {
		if(markers) {
			res.json({success: true, msg: 'Markers get correctly', markers: markers})
		} else {
			res.json({success: false, msg: 'No markers found'})
		}
	})
})

router.get('/getAllPublic', (req, res, next) => {
	Marker.find({private: false}).then(markers => {
		if(markers) {
			res.json({success: true, msg: 'Markers get correctly', markers: markers})
		} else {
			res.json({success: false, msg: 'No markers found'})
		}
	})
})

router.get('/getAllPrivate', (req, res, next) => {
	Marker.find({private: true}).then(markers => {
		if(markers) {
			res.json({success: true, msg: 'Markers get correctly', markers: markers})
		} else {
			res.json({success: false, msg: 'No markers found'})
		}
	})
})

// Get all markers by type for USER
router.get('/getAll/:id', (req, res, next) => {
	Marker.find().then(markers => {
		if(markers) {
			res.json({success: true, msg: 'Markers get correctly', markers: markers})
		} else {
			res.json({success: false, msg: 'No markers found'})
		}
	})
})

router.get('/getAllPublic/:id', (req, res, next) => {
	Marker.find({private: false}).then(markers => {
		if(markers) {
			res.json({success: true, msg: 'Markers get correctly', markers: markers})
		} else {
			res.json({success: false, msg: 'No markers found'})
		}
	})
})

router.get('/getAllPrivate/:id', (req, res, next) => {
	Marker.find({private: true}).then(markers => {
		if(markers) {
			res.json({success: true, msg: 'Markers get correctly', markers: markers})
		} else {
			res.json({success: false, msg: 'No markers found'})
		}
	})
})

module.exports = router