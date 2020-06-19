const http = require('http')
const express = require('express')
require('./db/mongoose')
require('./services/passport')
const cors = require('cors')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const socketio = require('socket.io');
const keys = require('./config/keys')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const photoRouter = require('./routers/photo')
const agencyRouter = require('./routers/agency')
const statusRouter = require('./routers/status')

const app = express()

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket)=> {
    console.log('we have a new connection')

    socket.on('disconnect', ()=> {
        console.log('user had left')
    })
})

const port = process.env.PORT || 5000



app.use(express.json())


app.use(bodyParser.json())
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
)

app.use(passport.initialize())
app.use(passport.session())

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

app.use(cors(corsOptions))
app.use(userRouter)
app.use(photoRouter)
app.use(taskRouter)
app.use(agencyRouter)
app.use(statusRouter)


app.listen(port, ()=>{
    console.log('Server is up on port: ' + port)
})

