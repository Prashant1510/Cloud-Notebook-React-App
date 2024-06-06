const connectToMongo = require('./db')
const express = require('express')
var cors = require('cors')

connectToMongo();

const app = express()
const port = 3005
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {              // use to show data on browser
  res.send('Hello Prashant!')
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(port, () => {                // it print on which port the app is running
  console.log(`Example app listening on port ${port} = http://localhost:${port}`)
})