import jsonwebtoken from 'jsonwebtoken';
const JWT_secret="Kr&ishi#sagoo@d$boy"
//get the user from jwt token and add id to req object
const fetchuser=(req,res,next)=>{
    const token=req.header('auth-token')
    if(!token)
    {
        return res.status(401).send("Please Authenticate yourself using valid token")
    }
    try 
    {
        const data = jsonwebtoken.verify(token,JWT_secret)
        req.user=data.user      //accessing user id from payoload 
        next() 
    } 
    catch (error) 
    {
        return res.status(401).send("Please Authenticate yourself using valid token ")
    }
}

export default fetchuser