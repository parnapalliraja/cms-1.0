const {StatusCodes} = require('http-status-codes')
const User = require('../model/userModel')
const bcrypt = require('bcryptjs')
const authController = {
    register: async (req, res) =>{
        
        try{
           // const { name, email, mobile, password } = req.body

           // const encPassword = await bcrypt.hash(password, 10)
             res.json({msg: "register"})
           /* const newUser = User({
                name,
                email,
                mobile,
                password
            }) */
           // res.json({data: newUser})
           res.status(StatusCodes.OK).json({ msg: "user registered successfully", data: newUser })
        }catch(err){
            return res.status(StatusCodes.INTERNAL_SERVAL_ERROR).json({msg: err.message})
        }
    },
    login: async (req,res) =>{
        try{
             res.json({msg: "login"})
        }catch(err){
            return res.status(StatusCodes.INTERNAL_SERVAL_ERROR).json({msg: err.message})
        }
    },
    logout: async (req,res) =>{
  try{
             res.json({msg: "logout"})
        }catch(err){
            return res.status(StatusCodes.INTERNAL_SERVAL_ERROR).json({msg: err.message})
        }
    },
    refereshToken: async (req,res) =>{
  try{
             res.json({msg: "refreshToken"})
        }catch(err){
            return res.status(StatusCodes.INTERNAL_SERVAL_ERROR).json({msg: err.message})
        }
    },
    resetPassword: async (req,res) =>{
  try{
             res.json({msg: "resetPassword"})
        }catch(err){
            return res.status(StatusCodes.INTERNAL_SERVAL_ERROR).json({msg: err.message})
        }
    },

}
module.exports = authController
