import { Router } from "express";
import { addProductToCart } from "./cart.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarConfirmacion } from "../middlewares/validar-confirmacion.js";

const router = Router();

router.post(
    "/add-to-cart",
    [
        validarJWT,
        validarCampos,
    ],
    addProductToCart
);

export default router;