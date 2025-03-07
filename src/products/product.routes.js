import { Router } from "express";
import { check } from "express-validator";
import { createProduct,getProducts, getProductsInactive ,getProductsById, updateProduct, deleteProduct, getOutOfStockProducts, getTopSellingProducts} from "./product.controller.js";   
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarConfirmacion } from "../middlewares/validar-confirmacion.js";
import { validarJWTADMIN } from "../middlewares/validar-jwt-admin.js";

const router = Router();

router.get("/", validarJWTADMIN, getProducts);

router.get("/:id",validarJWTADMIN, getProductsById);

router.get("/Product/Inactive", validarJWTADMIN, getProductsInactive);

router.post(
    "/",
    [
        validarJWTADMIN,
        validarCampos
    ],
    createProduct
)

router.put(
    "/:id",
    [
        validarJWTADMIN,
        validarConfirmacion
    ],
    updateProduct
)


router.delete(
    "/:id",
    [
        validarJWTADMIN,
        validarConfirmacion
    ],
    deleteProduct
)

router.get(
    "/get/stock",
    [
        validarJWTADMIN
    ],
    getOutOfStockProducts
)

router.get(
    "/top/selling",
    [
        validarJWTADMIN,
    ],
    getTopSellingProducts
)

export default router;