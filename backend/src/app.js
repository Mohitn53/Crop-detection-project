const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth.routes')
const scanRoutes = require('./routes/scan.routes')
const cookieparser = require('cookie-parser')
const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieparser())

app.use('/auth', authRoutes)
app.use('/api', scanRoutes)

module.exports = app