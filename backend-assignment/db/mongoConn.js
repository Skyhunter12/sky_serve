let dotenv = require('dotenv');
dotenv.config({path:'../config/dotenv.env'})
let mongoose = require('mongoose');
let MONGO_URI = process.env.mongo_uri;

let conn =mongoose.connect("mongodb://localhost:27017/sky_serve",
{useCreateIndex:true,
useNewUrlParser:true,
useUnifiedTopology:true}).then(()=>{
    console.log('connected');
}).catch(err=>{
    console.log(err);
})
module.exports = conn;
