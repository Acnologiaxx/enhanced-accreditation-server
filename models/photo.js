const mongoose = require('mongoose')
const User = require('./user')

const photoSchema = new mongoose.Schema({
    avatar:{
        type: Buffer
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

photoSchema.pre('save', async function (next) {
    await this.collection.deleteMany({ owner: this.owner})

    next()
})

const Photos = mongoose.model('Photos', photoSchema)

module.exports = Photos