import Router from "express";
import { register } from "../Controllers/auth.controller.js";


const route = Router();


route.post("/register", register);

export default route;