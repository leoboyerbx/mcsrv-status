require('dotenv-flow').config();
const express = require('express')
const discord = require('./discord')
const serverData = require('./minecraft/serverData')

const app = express()
const port = 6754

app.use('/', express.static('dist'))

app.get('/query', async (req, res) => {
  const result = await serverData()
    res.send(result)
  })

app.listen(port, () => {
  console.log(`Server app running at http://localhost:${port}`)
})

discord()
