const jwt =require('jsonwebtoken')

module.exports = async (req , res , next) =>{
    try {
        const token =req.headers["authorization"].split(" ")[1];
        jwt.verify(token , 'your_jwt_secret' , (err , decode) =>{
            if(err){
                return res.status(401).send({
                    message :"auth failed",
                    success: false
                })
            } else{
                req.body.userId = decode.userId; ;
                next();
            }
        } )
    } catch (error) {
        return res.status(401).send({
            message :"auth failed",
            success: false
        });
    }
};