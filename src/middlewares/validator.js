import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { existenteEmail, esRoleValido } from "../helpers/db-validator.js";

export const registerValidator = [
    body("name", "El nombre es obligatorio").not().isEmpty(), 
    body("surname", "El apellido es obligatorio").not().isEmpty(), 
    body("username", "El nombre de usuario es obligatorio").not().isEmpty(), 
    body("email", "Debes ingresar un email válido").isEmail(),
    body("email").custom(existenteEmail), 
    body("role", "El rol debe ser CLIENT_ROLE o ADMIN_ROLE").optional().custom(esRoleValido), 
    body("password", "La contraseña debe tener al menos 8 caracteres").isLength({ min: 8 }), 
    validarCampos 
];

export const loginValidator = [
    body("email", "Debes ingresar un email válido").isEmail().optional(),  
    body("username", "Debes ingresar un nombre de usuario válido").optional().isString(), 
    body("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }), 
];
