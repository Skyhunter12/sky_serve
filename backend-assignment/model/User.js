const dotenv = require('dotenv')
let mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {getLocation} = require('../common/geocoder')
dotenv.config({path:'../config/dotenv.env'})

const JWT_KEY = process.env.jwt_key
let userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        },
    tokens:[
        {token:{
            type:String,
            required:true
        }}
    ],
    address:{
        type:String
    },
    location: {
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: {
          type: [Number],
          index:'2dsphere'
        },
        city:String,
        formattedAddress:String,
        zipcode:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

userSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({ _id: this._id }, JWT_KEY);
        
        this.tokens =await this.tokens.concat({token})
        console.log("token",this.tokens);
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
        
        let response =JSON.stringify({
            'message':'Network error. We are working on it',
            'errors':error})
            throw new Error(response)
    }
 }

 userSchema.pre("save", async function(next) { 
     if(this.isModified("password")){
         this.password = await bcrypt.hash(this.password, 10);
        console.log("password",this.password);
        
    //  if(this.isModified('')){
         const {type,
         coordinates,
         location,
         zipcode }= await getLocation(this.address)
         console.log("location",location);
            this.location = {
                type: type,
                coordinates: coordinates,
                formattedAddress: location,
                zipcode: zipcode
            }

      }
     next();
 })
userSchema.index({location:'2dsphere'})
 const User = new mongoose.model("User", userSchema);
 module.exports = User;