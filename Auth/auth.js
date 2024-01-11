const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()
const auth = async(req,res,next)=>{
    try{
        if(req.headers.authorization){
            const token = req.headers.authorization
                const decode = await jwt.verify(token,process.env.KEY);
                if(decode){
                   req.userId = decode._id;
                   req.role = decode.role
                }
        }else{
            res.status(400).send({
                status:false,
                msg:"token not verified"
            })
        }     
        
        next();
    }catch(err){
        res.status(400).send({
            status:false,
            error:err.message
        })
    }
}

module.exports = auth