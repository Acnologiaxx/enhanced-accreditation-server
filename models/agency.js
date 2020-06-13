const mongoose = require('mongoose')

const agencySchema = new mongoose.Schema({
    agency_name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const agency = mongoose.model('Agency', agencySchema)

module.exports = agency