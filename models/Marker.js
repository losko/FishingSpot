const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const config = require('../config/database')

const ObjectId = mongoose.Schema.Types.ObjectId

// Marker Schema
const MarkerSchema = mongoose.Schema({
	name: {type: String, required: true},
	info: {type: String, required: true},
	lat: {type: Number, required: true},
	lng: {type: Number, required: true},
	draggable: {type: Boolean, required: true},
	editName: {type: Boolean, required: true},
	editInfo: {type: Boolean, required: true},
	author: {type: ObjectId, ref: 'Marker', required: true},
	private: {type: Boolean, required: true}
})

const Marker = module.exports = mongoose.model('Marker', MarkerSchema)

module.exports.addMarker = function (newMarker, callback) {
	newMarker.save(callback)
}