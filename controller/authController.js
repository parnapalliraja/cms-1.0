const {StatusCodes} = require('http-status-codes')
const User = require('../model/userModel')
const bcrypt = require('bcryptjs')
const { createAccessToken } = require('../util/token')
const jwt = require('jsonwebtoken')

const regTemplate = require('../template/regTemplate') //import regtemplate
const sendMail = require('../middleware/mail')

const authController = {
    register: async (req, res) => {
        
        try{
            const { name, email, mobile, password } = req.body

            const encPassword = await bcrypt.hash(password, 10)
           // res.json({data: { name, email, mobile, password }})
            const newUser = await User.create({
                name,
                email,
                mobile,
                password: encPassword
            }) 
            //res.json({data: newUser})
            const template = regTemplate(name,email)
            const subject = `confirmation of registeration with CMS-v1.0`;
            
            await sendMail(email,subject,template)

           res.status(StatusCodes.OK).json({ msg: "user registered successfully", data: newUser })
        }
        catch(err){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message})
        }
    },
    login: async (req,res) =>{
        try{
            const { email, password } = req.body
            //user exist or not
            const extUser = await User.findOne({ email })
            if(!extUser)
                return res.status(StatusCodes.NOT_FOUND).json({ msg: "user doesnot exist..."})

            //compare password
            const isMatch = await bcrypt.compare(password, extUser.password)
            if(!isMatch)
                return res.status(StatusCodes.BAD_REQUEST).json({ msg: "password is not match"})

            //generate token
            const accessToken = createAccessToken({ _id: extUser._id })

            // save token in cookie
            res.cookie('refreshToken', accessToken, {
                httpOnly: true,
                signed: true,
                path: `/api/v1/auth/refreshToken`,
                maxAge: 1 * 24 * 60 * 60  * 1000
            })
            
             res.json({ msg: "login successful", accessToken })
        }catch(err){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message})
        }
    },
    logout: async (req,res) =>{
  try{      
            res.clearCookie('refreshToken', { path: `/api/v1/auth/refreshToken`})
             res.json({msg: "logout"})
        }catch(err){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message})
        }
    },
    refereshToken: async (req,res) =>{
  try{
        const rf = req.signedCookies.refreshToken

        if(!rf)
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: "session expired, login again..."})

        // valid user id or not
        jwt.verify(rf, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{

            if(err)
                return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid Access Token.. Login again "})

            // valid token
            const accessToken = createAccessToken({ id: user._id})

            res.json({ accessToken })
        })
        //res.json({ rf })
        // res.json({msg: "refreshToken"})
        }catch(err){
            return res.status(StatusCodes.INTERNAL_SERVAL_ERROR).json({msg: err.message})
        }
    },

    resetPassword: async (req,res) =>{
  try{  
        const id = req.user.id
        const { password } = req.body
        // const { oldPassword, newPassword } = req.body
        const passwordHash = await bcrypt.hash(password, 10)

        const output =  await User.findByIdAndUpdate({ _id: id}, { password: passwordHash })
         res.json({ msg: "password reset success", output})
        }catch(err){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message})
        }
    },

}
module.exports = authController
