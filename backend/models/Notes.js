import mongoose from 'mongoose';
const { Schema } = mongoose;
const Noteschema = new Schema(
    {
        userid:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
        title:{
            type:String,
            required:true
            },
        description:{
            type:String,
            required:true
            },
        tag:{
            type:String,
            default:"Personal"
            },
        date:{
            type:Date,
            default:Date.now
            }
    }
)

export const Notes=mongoose.model('Notes',Noteschema)