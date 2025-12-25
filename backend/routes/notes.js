import { Router } from 'express'; 
const router = Router();
import fetchuser from '../middleware/fetchuser.js'
import {Notes} from '../models/Notes.js'
import {body,validationResult} from 'express-validator'


//Endpoint for fetching logged in user notes
router.get("/fetchnotes",fetchuser,async (req,res)=>{
    try 
    {
        const notes=await Notes.find({userid:req.user.id})      //finding the note of that particular user
        res.send(notes)  
    } 
    catch (error) 
    {
        console.error(error.message)
        return res.status(500).send("Internal Server Error ")  
    }
})


//Endpoint for adding notes 
router.post("/addnotes",fetchuser,[
    body("title","Title cannot be empty").notEmpty(),
    body("description","Description cannot be empty").notEmpty().isLength({min:20})
    ],
    async(req,res)=>{
        try 
        {            
            const errors=validationResult(req)  //checking for errors if any display them
            if(!errors.isEmpty())
            {
                return res.status(400).json({errors:errors.array()})
            }
            const{title,description,tag}=req.body       
            const notes=await new Notes({           //creating a note and adding data
                title,description,tag,userid:req.user.id
            })
            const savenote=await notes.save()
            res.json(savenote)
        } 
        catch (error) 
        {
            console.error(error.message)
            return res.status(500).send("Internal Server Error")
        }
})

//Endpoint for update existing note

router.put("/updatenote/:noteid",fetchuser,async(req,res)=>{
    try
    {
        const{title,description,tag}=req.body
        const Newnote={} //creating a newnote  
        if(title)                       //Checking whether user wants to update title
        {
            Newnote.title=title
        }
        if(description)                 //Checking whether user wants to update descriution
        {
            Newnote.description=description
        }
        if(tag)                         //Checking whether user wants to update tag
        {
            Newnote.tag=tag
        }
        //retrieving the note using noteid from endpoint at top  
        let note=await Notes.findById(req.params.noteid) 
        //checking whether note exists or not  
        if (!note)              
            {
                return res.status(404).send("Not found")
            }
            console.log("User id from request",req.user.id)
            console.log("User id from note",note.userid.toString())
        //Notes.js schema contains Userid field which include reference to the User Schema so bascailly checking here is User who is accessing the note has userid same as userid who created note 
        if(note.userid.toString()!==req.user.id)  
        {
            res.status(401).send("Unauthorize access to Notes Prohibited")
        }
    //$set method used to update mentions fields of the document while leaving other fields unchanged.
    //{new:true} return the update the document 
        note=await Notes.findByIdAndUpdate(req.params.noteid,{$set:Newnote},{new:true} )
        res.send(note)
    }                           
    catch (error)  
    {
        console.error(error.message)
        return res.status(500).send("Internal Server Error")
    }
}
)


//Enpoint for deleting an existing note
router.delete("/deletenote/:noteid",fetchuser,async(req,res)=>{
    //Finding the note that to be deleted exists or not
    try
    {
        let note=await Notes.findById(req.params.noteid)
        if(!note)
        {
            res.status(404).send("Note Not Found")
        }
        //checking whether the users  which he wants to delete belongs to him
        if(note.userid.toString()!==req.user.id)
        {
            res.status(401).send("Unauthorize access to Notes Prohibited")
        }
        note=await Notes.findByIdAndDelete(req.params.noteid)
        res.json({"Success":"Note has been deleted Successfully",note:note})
    }
    catch(error)
    {
        console.error(error.message)
        return res.status(500).send("Internal Server Error") 
    }
})
export default router