import jwt from "jsonwebtoken";
import Usuario from "../users/user.model.js"

export const validarJWT = async (req, res, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: "No Hay Token En La Peticion por favor ingrese el Token que se le ha proporcionado"
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        const usuario = await Usuario.findById(uid)

        if (!usuario) {
            return res.status(401).json({
                msg: "Usuario No Existente En La Data Base ponerse en contacto con el administrador"
            })
        }

        if (!usuario.state) {
            return res.status(401).json({
                msg: "Token No Valido - Usuario Status: False comuniquese con el administrador"
            })
        }

        req.usuario = usuario;

        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Token No Valido o ha expirado por favor ingrese nuevamente el token que se le ha proporcionado"
        })
    }

}