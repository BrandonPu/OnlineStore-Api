import { Router } from "express";
import { getCategories, saveCategory, deleteCategory, updateCategory } from "./categories.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWTADMIN } from "../middlewares/validar-jwt-admin.js";
import { validarConfirmacion } from "../middlewares/validar-confirmacion.js";

const router = Router();

router.get(
    "/",
    [
        validarJWTADMIN,
    ],
    getCategories
);  

router.post(
    "/",
    [
        validarJWTADMIN,
        validarCampos
    ],
    saveCategory
);

router.delete(
    "/:id", 
    [
        validarJWTADMIN,
        validarConfirmacion
    ],
    deleteCategory
);  

router.put(
    "/:id", 
    [
        validarJWTADMIN,
        validarConfirmacion
    ],
    updateCategory
);  

export default router;