require('dotenv-flow').config()
const express = require('express')
const ServerStatus = require('./minecraft/ServerStatus')
const discord = require('./discord')
const { existsSync } = require('fs')
const path = require('path')

if (!existsSync(path.resolve(__dirname, 'dist'))) {
    console.error('Warn: Missing client files, please run "pnpm run build" to make the website work.');
}

const app = express()
const port = 6754

app.use('/', express.static('dist'))

const serverStatus = ServerStatus.getInstance()
app.get('/query', (req, res) => {
    res.send(serverStatus.serverData)
})

app.listen(port, () => {
    console.log(`Server app running at http://localhost:${port}`)
})

// serverStatus.on('data', data => {
//   console.log(data)
// })
discord().then()
