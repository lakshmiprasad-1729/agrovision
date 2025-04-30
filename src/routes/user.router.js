import { createUser,userLogin,userLogout,userDetails } from "../controllers/user.controllers.js";
import Router from 'express'

const userRouter = Router();


userRouter
.route("/create-user").post(createUser);

userRouter
.route("/login-user").post(userLogin);

userRouter
.route("/logout-user").patch(userLogout);

userRouter
.route("/user-details").get(userDetails);


export default userRouter