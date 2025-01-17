const mongoose =  require('mongoose');
const validator = require('validator')
let MediaSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    mediaTitle:{
        type:String,
        min:3
    },
    date:{
        type:Date,
        default:Date.now
    },
    geoData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
})

let Media = mongoose.model('Media',MediaSchema);
module.exports = Media;