const mongoose =require('mongoose')

 const registerUser = async (req, res) => {
    try {
      const fail =await User.findOne({email :req.body.email});
      if(fail){
          res.status(200).send({message : "User Already Exist " ,success:false});
      }
      const newUser=new User(req.body)
      await newUser.save();
      res.status(200).send({message : "User Created Successfully " ,success:true});
  
    } catch (error) {
      console.log(err);
    }
  }

  const loginUser =async (req, res) =>{
    
  }

  module.exports={registerUser, loginUser}