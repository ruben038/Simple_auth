import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import db from "../models/index.js";
import { sendingMail } from "../middlewares/mailing.js";

const User = db.users;
const Token = db.token;

export const signup = async (req, res) => {
  try {
    const { userName, email, password, isVerified } = req.body;
    const data = {
      userName,
      email,
      password: await bcrypt.hash(password, 10),
      isVerified,
    };
    const user = await User.create(data);
    if (user) {
      let setToken = await Token.create({
        userId: user.id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      if (setToken) {
        sendingMail({
          from: "rubenhouenou@gmail.com",
          to: `${email}`,
          subject: "Vérification mail",
          text: `Hello, ${userName} Please verify your email by
            clicking this link :
            http://localhost:8080/api/users/verify-email/${user.id}/${setToken.token} `,
        });
      } else {
        return res.status(400).send("token not creted");
      }
      console.log("user", JSON.stringify(user, null, 2));

      //send users details
      return res.status(201).send(user);
    } else {
      return res.status(409).send("Details are not correct");
    }
  } catch (error) {
    console.log(error);
  }
};

export const verifyEmail = async(req,res)=>{
    try {
        const token = req.params.token 
        const usertoken =Token.findOne(token,{
            where : {
                userId:req.params.id
            }
        })
        console.log(usertoken);
        if(!usertoken){
            return res.status(400).send({
                msg: "Your verification link may have expired. Please click on resend for verify your Email.",
              })
        }
        else {
            const user = await User.findOne({where:{id:req.params.id}})
            if(!user){
                return res.status(401).send("User not found")
            }
            else if (user.isVerified) {
                return res.status(200).send("Veullez vous connectez")
            }
            else{
                const update = await User.upadate({
                    isVerified :true
                },{where :{
                    id:usertoken.userId
                }})
                console.log(update);
                if(!update){
                    res.status(500).send({msg:err.message})
                }
                else{
                    res.status(200).send("Votre compte est vérifié")
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}


export const login = async (req,res)=>{
    try {
        const {email,password}= req.body
        const user = User.findOne({email})
        if (user){
            const isSame = await bcrypt.compare(password,user.password)
            if(isSame){
                verified = user.isVerified 
                if(verified){
                    let token = jwt.sign({ id: user.id }, process.env.secretKey, {
                        expiresIn: 1 * 24 * 60 * 60 * 1000,
                      });
            
                      res.cookie("jwt", token, {
                        maxAge: 1 * 24 * 60 * 60,
                        httpOnly: true,
                      });
                      console.log("user", JSON.stringify(user, null, 2));
                      console.log(token);
                    return res.status(201).send(user)
                }
                else {
                    return res.status(401).send("Bah poto tu n'es pas vérifié")
                }
              
            }
            else {
               return res.status(401).send("Error dans le password")
            }
        }
        else {
            return res.status(401).send("Error dans l'authentification")
        }
    } catch (error) {
        console.log(error);
    }
}
