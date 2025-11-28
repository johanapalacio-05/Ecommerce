import express from "express";
import { registerUser } from "../controllers/Usercontrollers.js"; 

const router= express.Router();

//ruta para registar el usuario
router.post("/register", registerUser);

export default router;