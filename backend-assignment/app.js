const express = require('express');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
require('./db/mongoConn')
const cors = require('cors')

dotenv.config({ path:'./config/dotenv.env' })

const router = require('./router/router');
const PORT = process.env.PORT || 3000;

let app = express()

let corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200,
    credentials:true
  }
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({urlencoded:true}))

app.use('/media', express.static('./assets'))
app.use(cookieParser())
app.use('/api',router)

app.listen(PORT,()=>{
    console.log(`Listening to port numeber ${PORT}`);
})