const express = require('express')
const passport = require('passport')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()



router.post('/api/register', async (req, res) => {
    const user = new User(req.body)
    try {
        const existingEmail = await User.findOne({ email: req.body.email })
        if (existingEmail) {
            return res.send({ error: 'Email is already taken' })
        }
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ error: 'Success' })
    } catch (e) {
        res.status(400).send({ error: 'something bad happened'})
    }
})

router.post('/api/login', passport.authenticate('local', {
    failureRedirect: '/login'
}), (req, res) => {
    res.send(req.user)
})


router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
})
)

router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/dashboard')
})

router.get('/api/logout', async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        req.logout();
        res.redirect('/');
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/api/current_user', (req, res) => {
    try {
        res.send({
            user: req.user,
            token: req.user.tokens[0].token
        })
    } catch (e) { res.send() }
})

router.get('/api/v1/users', async (req, res) => {
    try {
        const allUsers = await User.find({})
        res.send(allUsers)
    } catch (e) {
        res.send({ users: '' })
    }
})

router.get('/api/v1/:userid', async (req, res) => {
    try {
        const singleUser = await User.findById(req.params.userid)
        res.send(singleUser)
    } catch (e) {
        res.send('')
    }
})

router.patch('/api/update/user', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['first_name', 'last_name', 'email', 'position', 'college', 'department']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/api/update/:uzer', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['first_name', 'last_name', 'email', 'position', 'college', 'department']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try {
        const user = await User.findById(req.params.uzer)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router