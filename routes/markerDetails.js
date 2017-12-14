const express = require('express')
const router = express.Router()
const config = require('../config/database')
const Marker = require('../models/Marker')
const User = require('../models/User')
const MarkerDetails = require('../models/MarkerDetails')

// Get by id
router.get('/getById/:id', (req, res) =>{
	let markerDetailsId = req.query.id
	MarkerDetails.findById(markerDetailsId).populate('marker').then(markerDetails => {
		res.json({success: true, msg: 'MarkerDetails Found', markerDetails: markerDetails})
	})
})

router.post('/updateDetails/:id', (req, res) => {
	const id = req.body.id
	const imgUrl = req.body.img
	const name = req.body.name
	const detailsInfo = req.body.markerInfo
	MarkerDetails.findOneAndUpdate({_id: id}, {$set:{imgUrl: imgUrl, name: name, detailsInfo :detailsInfo } }, {new: true}, (err, markerDetails) => {
		if(err) {
			return console.log(err)
		} else {
			res.json({success: true, msg: 'Markers Info Updated!', markerDetails: markerDetails})
		}
	})
})

module.exports = router