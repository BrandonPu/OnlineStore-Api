import { hash, verify } from "argon2";
import { generarJWT } from "../helpers/generate-jwt.js";
import Usuario from "../users/user.model.js";

export const createAdminUser = async () => {
    try {
        const adminExists = await Usuario.findOne({ role: "ADMIN_ROLE" });

        if (!adminExists) {
            const hashedPassword = await hash("admin2025", 10); 

            const adminUser = new Usuario({
                name: "Admin",
                surname: "System",
                username: "AdminSystem",
                email: "admin@system.com",
                password: hashedPassword,
                role: "ADMIN_ROLE", 
                state: true,
                purchaseHistory: [],
                cart: [],
                invoices: []
            });

            await adminUser.save();
            console.log("Administrador creado correctamente.");

        } else {
            console.log("El administrador ya existe en la base de datos.");
        }

    } catch (error) {
        return res.status(500).json({
            msg: "Error al Crear el Administrador porfavor vuelve intertarlo"
        })
    }
};

export const register = async (req, res) => {
    const data = req.body;

    try {

        if (data.role === 'ADMIN_ROLE') {
            return res.status(400).json({
                message: 'No te puedes registrar con el rol de ADMIN_ROLE solo el Administrador lo puede hacer.'
            });
        }

        const existingUser = await Usuario.findOne({
            $or: [{ username: data.username }, { email: data.email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'El correo o el nombre de usuario ya están registrados. Por favor ingrese otro diferente.'
            });
        }

        const encryptedPassword = await hash(data.password);

        const user = await Usuario.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
            role: data.role || "CLIENT_ROLE",
            cart: [], 
            purchaseHistory: [], 
            invoices: [], 
            state: true
        })

        return res.status(201).json({
            message: "Usuario registrado exitosamente",
            userDetails: {
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            msg: "Error al registrar Usuario si persiste comuniquese con el Administrador"
        })
    }
}

export const login = async (req, res) => {

    const { email, password, username } = req.body;

    try {
        const user = await Usuario.findOne({
            $or: [{ email }, { username }]
        });

        if (!user) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas, Correo o nombre de usuario no existe en la base de datos.'
            });
        }

        if (!user.state) { 
            return res.status(400).json({
                msg: 'El usuario está deshabilitado. Por favor, contacte con el administrador.'
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Contraseña incorrecta. Por favor, intente nuevamente.'
            });
        }

        const token = await generarJWT(user.uid); 

        return res.status(200).json({
            msg: 'Inicio de sesión exitoso.',
            userDetails: {
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token,
                cart: user.cart,
                invoices: user.invoices,
                purchaseHistory: user.purchaseHistory

            }
        });

    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: "Error del servidor",
            error: e.message
        });
    }
};