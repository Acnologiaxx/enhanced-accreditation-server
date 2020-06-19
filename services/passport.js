const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const localStrategy = require('passport-local').Strategy
const keys = require('../config/keys')
const User = require('../models/user')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user)=> {
        done(null, user)
    })
})

passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        const existingUser = await User.findOne({ googleId: profile.id })
            if(existingUser){
                await existingUser.generateAuthToken()
                return done(null, existingUser)
            }

            const user = await User({ 
                googleId: profile.id,
                first_name: profile._json.given_name,
                last_name: profile._json.family_name,
                email: profile._json.email,
            }).save()

            await user.generateAuthToken()
            done(null, user)
        }
    )
)


passport.use(
    new localStrategy({ 
        usernameField: 'email' 
    } ,  async ( email, password, done) => {
            const user = await User.findByCredentials(email,password)
            if(user){
                return done(null, user)
            }
        }
    )
)
