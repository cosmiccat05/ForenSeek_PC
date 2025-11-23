import User from "../models/User.js"
import jwt from "jsonwebtoken"

const createToken=(_id)=>{
    return jwt.sign({_id}, process.env.SECRET,{expiresIn:'3d'})
}

export async function loginUser(req,res){
    const{correo,contra}=req.body
    try {
        const user=await User.login(correo, contra)
        const token=createToken(user._id)
        res.status(200).json({correo, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

export async function registerUser(req,res){
    const {nombres, apellidos, correo, contra}=req.body
    try {
        const user=await User.register(nombres, apellidos, correo, contra)
        const token=createToken(user._id)
        res.status(200).json({correo, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
