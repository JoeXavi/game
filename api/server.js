const express = require('express')
const app = express();
const server = require('http').Server(app)
const cors = require('cors')

const bodyParser = require('body-parser')
const routes = require('./network/routes')
const { config } = require('./config/index')

const db = require('./db')

app.use(bodyParser.urlencoded({ limit: '900mb', extended: true }))
app.use(bodyParser.json({ limit: '900mb' }))


// app.set('view engine', 'ejs');
// app.use(express.static(__dirname +'/public'));
app.use(cors())

db(config.mongo)
routes(app);

server.listen(3000,()=>{
  console.log("Server listen port 3000")
})
