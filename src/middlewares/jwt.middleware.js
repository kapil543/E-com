
import jwt from 'jsonwebtoken';
const jwtAuth=(req,res,next)=>{
    //1.Read the token
    const token= req.headers['authorization'];
     //2.if no token ,return the error.
     console.log(token);
    if(!token){
        return res.status(401).send("Unauthorized");
    }
    //3.check if token is valid.
    try{
     const payload =jwt.verify(token,"falsdfjadsd324032adjsd")
     req.userID=payload.userID;
    }catch(err){
         //4.call next middleware
        return res.status(401).send('Unauthorized h');
    }

     
    
    

    //5.return error.
    next()
}

export default jwtAuth;