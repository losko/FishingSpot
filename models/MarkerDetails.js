const mongoose = require('mongoose')
const config = require('../config/database')

const ObjectId = mongoose.Schema.Types.ObjectId

const MarkerDetailsSchema = mongoose.Schema({
	name: {type: String},
	detailsInfo: {type: String},
	imgUrl: {type: String},
	marker: {type: ObjectId, ref: 'Marker'}
})

const MarkerDetails = module.exports = mongoose.model('MarkerDetails', MarkerDetailsSchema)

