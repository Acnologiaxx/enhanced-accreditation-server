const mongoose = require('mongoose')

const statusSchema = new mongoose.Schema({
    status:{
        default: 0,
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Agency'
    }
}, {
    timestamps: true
})

const status = mongoose.model('Status', statusSchema)

module.exports = status