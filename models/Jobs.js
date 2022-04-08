const mongoose = require('mongoose')

const JobSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	companyName: {
		type: String,
		required: true
	},
	companyLocation: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	}
})

const Job = mongoose.model('Jobs', JobSchema)

module.exports = Job