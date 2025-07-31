const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const config = require('./config/config.json')
const cluster = require('cluster')

require('./core/globalAnticrash')
const app = express()

const workerId = cluster?.worker?.id || 0
const port = (config.port || 3000) + workerId

app.use(cors({
	origin: '*' // Ou '*' si tu veux autoriser tout le monde temporairement
}));
app.use(express.json({ limit: '10mb'}))
app.use(express.urlencoded({ extended: true, limit: "5mb" }))

app.use((req, res, next) => {
    console.log(`(WK-${process.pid}) [✅] » [DEBUG] Requête reçue: ${req.method} - ${req.url}`)
    next()
})

require('./handlers/middleware')(app)
require('./handlers/router')(app)

app.use((req, res, next) => {
    console.log(`(WK-${process.pid}) [✅] » [API] Requête reçue: ${req.method} ${req.url}`)
    next()
})

app.listen(port, () => {
    console.log(`(WK-${process.pid}) [✅] » [API] Server running on port ${port}`)
})