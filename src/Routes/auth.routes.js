import Router from "express";
import { logIn, register } from "../Controllers/auth.controller.js";


const route = Router();


route.post("/register", register);
route.post("/login", logIn);

export default route;