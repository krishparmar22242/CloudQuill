//function to connect to mongoose
import mongoose from 'mongoose';
// Allow MONGO_URI from environment variables (for Docker) or fallback to localhost
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/';

const connecttomongo =async()=>{
    await mongoose.connect(mongoURI)
    .then(()=>console.log("Mongodb Connected Successfully"))
    .catch((err)=>console.log(err))
}
    
export default connecttomongo;

