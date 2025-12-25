import {Router} from 'express'
import {User} from '../models/User.js'
import {body,validationResult} from 'express-validator'
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import fetchuser from '../middleware/fetchuser.js'

const router = Router()

const JWT_secret="Kr&ishi#sagoo@d$boy"

// CREATING A USER THROUGH POST REQUEST IN MONGO DB DATABASE  no login 
// adding filters and validators to check for invalid name ,email and password 
router.post("/createuser",[
    body('email','Enter a valid email').isEmail(),
    body('name','Enter a valid name').isLength({min:5}),
    body('password','Password should be atleast 3 characters').isLength({min:8}),
    ],async(req,res)=>{
        let success=false
    const errors = validationResult(req);           //checking for errors if present display them
    if (!errors.isEmpty()) 
        {
            return res.status(400).json({errors:errors.array()});
        }
    try                         
    {
        let user= await User.findOne({email:req.body.email})    //checking user with same email exist
        console.log(user)
        if (user) //if yes return error 
        {
            success=false
            return res.status(400).json({success,error:"Sorry! User with the same email exist"})
        }
        const salt= await bcrypt.genSalt(10)
        const hashpass=await bcrypt.hash(req.body.password,salt)
        user=await User.create({                 //else create user  
            name:req.body.name,
            email:req.body.email,
            password:hashpass,
        })
        const data={
            user:{
                id:user.id
            }
        }
        const auth_token=jsonwebtoken.sign(data,JWT_secret)
        success=true                  
        res.json({success,auth_token})  
    } 
    catch (error)                   //if there is some display it 
    {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
})

//creating a new endpoint for user login 
router.post('/login',
    [
        body("email","Enter a valid Email").isEmail(),
        body("password","Password Cannot be empty").notEmpty()
    ],
    async(req,res)=>
        {
            let success=false;
            const errors=validationResult(req)
            if (!errors.isEmpty())
            {
                success=false
                return res.status(400).json({success,errors:errors.array()})
            }
            try 
            {
                let user=await User.findOne({email:req.body.email})
                if(!user)
                    {
                        success=false
                        return res.status(400).json({success,error:"Please Enter Valid Credentials"})
                    }

                const passwordres=await bcrypt.compare(req.body.password,user.password)
                if(!passwordres)
                {
                    success=false
                    return res.status(400).json({success,error:"Please Enter Valid Credentials"})
                }
                const data=
                {
                    user:{
                        id:user.id
                    }
                }
                let auth_token=jsonwebtoken.sign(data,JWT_secret)
                success=true
                return res.json({success,auth_token})
            } 
            catch (error) 
            {
                console.error(error.message)
                return res.status(500).send(error.message)
            }
            
        })

// GET user detail of the logged in user

router.post("/getuser",fetchuser,
    async (req,res)=>{
        try 
        {
            const userid=req.user.id
            const user=await User.findById(userid).select("-password")
            return res.send(user)
        } 
        catch (error) 
        {
            console.error(error.message)
            return res.status(500).send(error.message)
        }


    }
)
export default router
