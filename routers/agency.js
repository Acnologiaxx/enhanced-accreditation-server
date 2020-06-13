const express = require('express')
const Agency = require('../models/agency')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/api/v2/agency', async (req,res)=>{
    // const task = new Task(req.body)
    const agency = new Agency({
        ...req.body
    })
    try {
        await agency.save()
        res.status(201).send(agency)
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/api/all/agency', async (req,res)=>{
    try {
        const agencies = await Agency.find({})
        res.send(agencies)
    } catch (e) {
        res.send('')
    }
})

router.get('/agency/:id', async (req,res)=>{
    try {
        const agency = await Agency.findOne(req.params.id)
        if(!agency){
            return res.status(404).send()
        }
        res.send(agency)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/agency/:id', async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['agency_name','description']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates'})
    }

    try{
        const agency = await Agency.findOne(req.params.id)
        
        if(!agency){
            return res.status(404).send()
        }
        

        updates.forEach((update) => agency[update] = req.body[update])
        await agency.save()
        res.send(agency)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/agency/:id', async (req,res)=>{
    try{
        const agency = await Agency.findOneAndDelete(req.params.id)

        if(!agency){
            return res.status(404).send()
        }
        res.send(agency)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router