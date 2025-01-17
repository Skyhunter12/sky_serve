const express = require("express");
const multer = require('multer');

const router = new express.Router();
const {body} = require('express-validator');
const { registerCntrl,
        loginCntrl,
        logoutCntrl} = require('../controller/authcontroller');
const { getAllMedia,
        postMedia,
        deleteMediaById,
        } = require('../controller/mediacontroller');        
const {middleware,
    loginmiddleware} = require('../middleware/middleware');

let storage = multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'./assets/media')
        },
        filename:(req,file,cb)=>{
            let date =Date.now()
            const filename = file.originalname.toLowerCase().split(' ').join('-').replace(/(\.[^\.]+)$/,date+'$1');
            cb(null,filename)
        }
})
let upload = multer({
        storage:storage,
        limits:{
            fileSize:1024 * 1024 * 5
        },
        fileFilter:(req,file,cb)=>{

            console.log("file mimetype",file.mimetype);
            if(file.mimetype === "image/tiff" ||
            file.mimetype === "application/json" ||
            file.mimetype === "application/vnd.geo+json" ||
            file.mimetype === "application/vnd.google-earth.kml+xml" ||
            file.mimetype === "application/xml"){
             cb(null, true);
            }else{
                cb(null, false)
                return cb(new Error('only .png, .jpg/jpeg, .gif, .mp4, .ogg, .wmv, .x-flv, .avi, .webm, .mkv, .avchd, .mov  are allowed'));
            }
        }
});
    

router.post("/v1/register",registerCntrl )
// login check
router.post("/v1/login",loginmiddleware,loginCntrl)

router.get("/v1/media",middleware ,getAllMedia);

router.post('/v1/media',[body('email','Please add correct Email').isEmail(),
    body('mediaTitle','Title Length should be 3 or more').isString().isLength({min:3}).trim(),
middleware,upload.single('geoData')] ,postMedia)

// router.delete("/media/:id",middleware,deleteMediaById)

router.get('/v1/logout',middleware, logoutCntrl)


module.exports = router;