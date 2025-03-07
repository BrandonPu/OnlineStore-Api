import { Router } from "express";
import { getClients,createUser, updateUser, deleteUser } from "./user.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWTADMIN } from "../middlewares/validar-jwt-admin.js";
import { validarConfirmacion } from "../middlewares/validar-confirmacion.js";

const router = Router();

router.get(
    "/",
    [
        validarJWTADMIN,
        validarCampos,
    ],
    getClients
);

router.post(
    "/createUser",
    [
        validarJWTADMIN,
        validarCampos,
    ],
    createUser
);

router.put(
    "/:id",
    [
        validarJWTADMIN,
        validarCampos,
        validarConfirmacion,
    ],
    updateUser
);

router.delete(
    "/:id",
    [
        validarJWTADMIN,
        validarCampos,
        validarConfirmacion,
    ],
    deleteUser
);
export default router;