const express = require('express')
const Photo = require('../models/photo')
const auth = require('../middleware/auth')
const multer = require('multer')
const router = new express.Router()

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a picture'))
        }

        cb(undefined, true)
    }
})

router.post('/api/avatar', upload.single('avatar'), async (req, res) => {
    const photo = new Photo({
        ...req.body,
        owner: req.user._id
    })
    const file = req.file.buffer
    photo.avatar = file
    await photo.save()
    res.send({ id: photo._id })
}, (error, req, res, next) => {
    res.status(400).send({ error: 'error message' })
})

router.get('/api/avatar/:id', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id)
        if (!photo || !photo.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(photo.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

router.get('/api/me', async (req, res) => {
    try {
        const photo = await Photo.findOne({owner: req.user._id})
        res.send({ id: photo._id })
    } catch (e) {
        res.send({ id: null})
    }
})



router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router