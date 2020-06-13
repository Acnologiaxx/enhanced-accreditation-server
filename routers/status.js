const express = require('express')
const Status = require('../models/status')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/status', async (req,res)=>{
    const status = new Status()

    try {
        await status.save()
        res.status(201).send(status)
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/api/all/status', async (req,res)=>{
    try {
        const status = await status.find({})
        res.send(status)
    } catch (e) {
        res.send('')
    }
})

router.get('/status/:id', async (req,res)=>{
    try {
        const status = await Status.findOne(req.params.id)
        if(!status){
            return res.status(404).send()
        }
        res.send(status)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/status/:id', async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['status']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates'})
    }

    try{
        const status = await Status.findOne(req.params.id)
        
        if(!status){
            return res.status(404).send()
        }
        

        updates.forEach((update) => status[update] = req.body[update])
        await status.save()
        res.send(status)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/status/:id', async (req,res)=>{
    try{
        const status = await Status.findOneAndDelete(req.params.id)

        if(!status){
            return res.status(404).send()
        }
        res.send(status)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router