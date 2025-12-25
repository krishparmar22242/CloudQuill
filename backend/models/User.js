import mongoose from 'mongoose';
import {Schema} from 'mongoose'

const Userschema = new Schema(
    {
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
            unique:true
            },
        date:{
            type:Date,
            default:Date.now
            }
    }
);


export const User = mongoose.model('User', Userschema);