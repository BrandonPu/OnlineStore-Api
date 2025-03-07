import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { getProductsCategoy, getTopSellingProducts, searchProductsByName, getCategories, getProductsByCategoryName} from "./clients.controller.js";
import { validarConfirmacion } from "../middlewares/validar-confirmacion.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/products/Home", validarJWT, getProductsCategoy);

router.get(
    "/top/selling",
    [
        validarJWT,
    ],
    getTopSellingProducts
)

router.get("/search", validarJWT, searchProductsByName);

router.get("/categories", validarJWT, getCategories);

router.get("/products/category/:categoryName", validarJWT, getProductsByCategoryName);

export default router;
