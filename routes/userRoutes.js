import express  from "express";
import {signup,login,verifyEmail} from "../controllers/userController.js"
import saveUser from "../middlewares/userAuth.js"

const router =express.Router()

router.post("/signup",saveUser,signup)
router.post("login",login)
router.get("verify-email/:id:/token",verifyEmail)

export default router