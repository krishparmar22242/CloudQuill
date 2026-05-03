import 'dotenv/config';
import  connecttomongo from "./db.js"
import express from "express"
import notesrouter from './routes/notes.js'
import authrouter from './routes/auth.js';
import cors from "cors";
connecttomongo();

const app = express();
app.use(cors());
const port = 5000;


app.use(express.json()); 

app.use('/api/auth' ,authrouter)
app.use('/api/notes' , notesrouter)
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})