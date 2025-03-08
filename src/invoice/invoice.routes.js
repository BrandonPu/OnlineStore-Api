import { Router } from "express";
import { check } from "express-validator";
import { getPurchaseHistory ,getUserInvoices, getInvoiceDetails, completePurchase, editInvoice } from "./invoice.controller.js"
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarConfirmacion } from "../middlewares/validar-confirmacion.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarJWTADMIN } from "../middlewares/validar-jwt-admin.js";

const router = Router();
router.get('/history', validarJWT, getPurchaseHistory);


router.get("/user/invoices", validarJWT, getUserInvoices);

router.get("/:invoiceId", validarJWT, getInvoiceDetails);

router.post("/complete-purchase/:cartId", validarJWT, validarConfirmacion, completePurchase);

router.put("/:invoiceId", validarJWTADMIN,validarConfirmacion, editInvoice);

export default router; 