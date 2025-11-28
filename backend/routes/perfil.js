import express from "express";
import {obtenerPerfil, actualizarperfil, eliminarperfil} from '../controllers/perfil.js';

const router=express.Router();

router.post('/obtener',obtenerPerfil);
router.put('/actualizar', actualizarperfil);
router.delete('/eliminar', eliminarperfil);

export default router;
