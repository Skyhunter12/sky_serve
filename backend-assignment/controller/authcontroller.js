const User = require('../model/User');
const bcrypt = require('bcryptjs')
// post register @route /register
exports.registerCntrl = async (req, res) =>{
    try {
      const password = req.body.password;
      let success = false;
      if(password){
        const registerUser = new User({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                address:req.body.address             
        })
        let token = await registerUser.generateAuthToken();
        res.cookie("jwt",token,{expires:new Date(Date.now() + 900000)})
        const registered = await registerUser.save();
        if(registered){
            success = true
            let respData = {
                'message':'User registered successfully',
                'success':success,
                'data':registered
            }
            return res.send(respData)
        }else{
            success = false;
            let respData = {
                'message':'Failed to register',
                'success':success,
                'data':`${registered.name} is failed in validation/s`
            }
            return res.send(respData);
        }
      }else{
          res.send("password is not valid")
      }
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        res.status(500).json({
            'message':'Network error. We are working on it',
            'errors':error})
    }
}

// post login @route /login
exports.loginCntrl = async (req, res,next) =>{
    try {
        let success = false;
         const email = req.body.email;
         const password = req.body.password;
         const useremail = await User.findOne({email:email});
         const isMatch = await bcrypt.compare(password, useremail.password);
         let token; 
         if(!req.token){
         token = await useremail.generateAuthToken();
        }else{
            token = req.token;
        }
         if(isMatch){
             success=true
             delete await useremail.password;
             let data={
                message:'Data verified successfully',
                success,
                data:useremail
             };
             await res.cookie("jwt", token, {
                expires: new Date(Date.now() + 900000),
                httpOnly: true,
                secure: false // set to true if using HTTPS
            });
           return await res.status(200).send(data);
         }else{
             success=false
             let data={
                 'message':'Invalid credentials',
                 'success':success,
                 'Data':[]
             };
           return res.status(400).send(data); 
         }
    } catch (error) {
        res.status(500).json({
            'message':'Network error. We are working on it',
            'errors':error})
    }
 }

//  get incircle friends @route /incircle
exports.getProfile = async (req, res, next) =>{
    try {
        let user = await req.user;
    }catch(err){
        res.status(500).json({
            'message':'Network error. We are working on it',
            'errors':error})
    }
}

// get logout @route /logout
exports.logoutCntrl = async(req,res)=>{
    try {
        req.user.tokens = [];
        res.clearCookie("jwt");
        await req.user.save()
        await User.updateOne({_id:req.user._id},{$set:{tokens:[]}});
        res.send('Logged out successfully');
    } catch (error) {
        res.status(500).json({
            'message':'Network error. We are working on it',
            'errors':error})
    }
}
