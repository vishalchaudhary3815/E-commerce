const userModel = require("./user.Model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const userApi = {};
userApi.signUp = async (req, res) => {
  try {
    const data = req.body;
    const isExist = await userModel.findOne({ email: data.email });
    if (isExist) {
      res.status(400).send({
        status: false,
        msg: "email already exist",
      });
    } else {
      const encrypt = await bcrypt.hash(data.password, 10);
      if (encrypt) {
        data.password = encrypt;
        const save = await userModel.create(data);
        if (save) {
          res.status(200).send({
            status: true,
            msg: "user registered",
          });
        } else {
          res.status(400).send({
            status: false,
            msg: "user not registered",
          });
        }
      } else {
        res.status(400).send({
          status: false,
          msg: "user not registered",
        });
      }
    }
  } catch (error) {
    res.status(400).send({
      status: false,
      err: error.message,
    });
  }
};

userApi.signIn = async (req, res) => {
  try {
    const data = req.body;
    const isExist = await userModel.findOne({ email: data.email });
    if (isExist) {
      const decrypt = await bcrypt.compare(data.password, isExist.password);
      if (decrypt) {
        const token = await jwt.sign(
          { _id: data._id, role: data.role },
          process.env.KEY,
          { expiresIn: "3h" }
        );
        if (token) {
          res.status(200).send({
            status: true,
            Token: token,
            Data: isExist,
          });
        } else {
          res.status(400).send({
            status: false,
            msg: "token not generated",
          });
        }
      } else {
        res.status(400).send({
          status: false,
          msg: "wrong password",
        });
      }
    } else {
      res.status(400).send({
        status: false,
        msg: "user not exist",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: false,
      err: error.message,
    });
  }
};

userApi.changePassword = async(req,res)=>{
    try {

        const {email,oldpassword,newpassword} = req.body;
        const isExist = await userModel.findOne({email:email});
        if(isExist){
            const passwordverify = await bcrypt.compare(oldpassword,isExist.password);
            if(passwordverify){
                const encrypt = await bcrypt.hash(newpassword,10);
                if(encrypt){
                const save = await userModel.findOneAndUpdate({email:email},{password:encrypt},{new:true});
                res.status(200).send({
                    status:true,
                    msg:"password changed"
                })
                }else{
                    res.status(400).send({
                        status:false,
                        msg:"password not changed"
                    })
                }
            }else{
                res.status(400).send({
                    status:false,
                    msg:"olpassword not matched"
                })
            }
        }else{
            res.status(400).send({
                status:false,
                msg:"user not exist"
            })
        }
        
    } catch (error) {
        res.status(400).send({
            status:false,
            err:error.message
        })
    }
}

userApi.changepassword = async(req,res)=>{
  try {
    const {oldPassword,newPassword, } = req.body;
    const isExist = await userModel.findOne({_id:req.userId});
    if(!isExist){
       res.status(400).send({
        status:false,
        msg:"user not exist"
       })
    }else{
      const vrfpassword = bcrypt.compare(oldPassword,isExist.password);
      if(vrfpassword){
        if(newPassword === confirmPassword){
          const encrypt = bcrypt.hash(newPassword,10);
            const save = await userModel.findOneAndUpdate({_id:req.userId},{password:newPassword},{new:true})
            if(save){
              res.status(200).send({
                status:true,
                msg:"password changed"
              })
            }else{
              res.status(400).send({
                status:false,
                msg:"password not changed"
              })
            }
        }else{
          res.status(400).send({
            status:false,
            msg:"confirmpassword not matched with newPassword"
          })
        }
      }else{
        res.status(400).send({
         status:false,
         msg:'wrong password'
        })
      }
    }
    
  } catch (error) {
    res.status(400).send({
      status:false,
      err:error.message
    })
  }
}
module.exports = userApi;
