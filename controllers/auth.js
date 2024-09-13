const { BadRequestError, UnauthenticatedError } = require('../errors')
const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')


const register = async(req, res) => {
    // const user = await User.create({name:req.body.name, email:req.body.email, password:req.body.password})
    const {name, email, password} = req.body
    if(!name || !email || !password){
        throw new BadRequestError('Please provide name, email and password')
    }
      const user = await User.create({...req.body})
      const token = user.createJWT()
      res.status(StatusCodes.CREATED).json({user,token}) 
         
}

const login = async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError('Invalid credentials')
    }
    
    const isPassword = await user.comparePassword(password)

    if(!isPassword){
        throw new UnauthenticatedError('Invalid password')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{name:user.name},token})
}






module.exports = {register, login}