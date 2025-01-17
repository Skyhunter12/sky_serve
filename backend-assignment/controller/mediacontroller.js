const express = require('express');
const { readFile, sanitizeData } = require('../common/filesupport');
const { isValidEnum } = require('../common/utils');
const Media = require('../model/MediaModel');

exports.getAllMedia = async (req, res , next)=>{
    try {
        let filter = {}
        if(req.query.mediaTitle && req.query?.mediaTitle?.length>0){
            filter.mediaTitle = req.query.mediaTitle
        }
        if(req.query.mediaType && isValidEnum(req.query.mediaType)){
            filter.mediaType = req.query.mediaType
        }

        let media = await Media.find(filter);

        res.status(200).json({
            'message':'Media fetched successfully',
            'success':true,
            'media':media
        })
        
    } catch (error) {
        res.status(500).json({
            'message':'Internal server error',
            'success':false
        })
    }

}

exports.postMedia = async (req, res , next)=>{
    if(!req.file){
        res.status(400).json({
            'message':'Please upload a file',
            'success':false
        })
    }
    let geodata  =await readFile(req.file.path).then(async(data)=>{
        return data
        
    }).catch((error)=>{
        console.log("41 error",error);
        throw new Error("error in readfile function")
    })
    
    if(!geodata){
        res.status(400).json({
            'message':'Unable to read the file',
            'success':false
        })
    }
    let url = req.protocol+'://'+req.get('host');    
    let media_url = `${url}/assets/media/${req.file.filename}`
    let mediaTitle = req.body.mediaTitle
    let sanitisedGeoData = await sanitizeData(geodata)
    
    console.log("media title", mediaTitle);
    console.log("media url", media_url);
    console.log("geoData", sanitisedGeoData);
    
    let media =await new Media({
        mediaTitle:mediaTitle,
        mediaUrl:media_url,
        email:req.user.email,
        geoData:sanitisedGeoData
    })
    try{
    await media.save()
    await res.status(200).json({
        'message':'Media uploaded successfully',
        'success':true,
        'mediaTitle':mediaTitle
    })
    }catch(err){
        throw new Error(err)
    }
}