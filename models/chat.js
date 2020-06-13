const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    message:{
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const chat = mongoose.model('Chat', chatSchema)

module.exports = chat