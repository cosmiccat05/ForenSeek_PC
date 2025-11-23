import mongoose from "mongoose"
import bcrypt from "bcrypt"
import validator from "validator"

const userSchema=new mongoose.Schema({
    nombres:{
        type:String,
        required:true,
    },
    apellidos:{
        type:String,
        required:true,
    },
    correo:{
        type:String,
        required:true,
        unique:true
    },
    contra:{
        type:String,
        required:true,
    },
})

userSchema.statics.register=async function(nombres, apellidos, correo, contra){
    if(!nombres || !apellidos || !correo || !contra){
        throw Error('Hay campos vacíos')
    }
    if(!validator.isEmail(correo)){
        throw Error('Correo no válido')
    }
    if(!validator.isStrongPassword(contra)){
        throw Error('Contraseña débil')
    }
    
    const exists=await this.findOne({correo})
    if(exists){
        throw Error('Ya hay una cuenta con ese correo')
    }

    const salt=await bcrypt.genSalt(10)
    const hash=await bcrypt.hash(contra,salt)
    const user=await this.create({nombres, apellidos, correo, contra: hash})
    return user
}

userSchema.statics.login=async function (correo, contra) {
    if(!correo || !contra){
        throw Error('Hay campos vacíos')
    }
        
    const user=await this.findOne({correo})
    if(!user){
        throw Error('No hay ningún usuario con ese correo')
    }

    const match=await bcrypt.compare(contra, user.contra)
    if(!match){
        throw Error('Contraseña incorrecta');
    }

    return user
}

const User=mongoose.model("User", userSchema)

export default User