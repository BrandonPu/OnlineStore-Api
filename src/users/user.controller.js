import { response, request } from "express";
import { hash, verify } from "argon2";
import User from "./user.model.js";

export const getClients = async (req, res = response) => {
    try {

        const clients = await User.find({ role: 'CLIENT_ROLE' });

        res.status(200).json({
            success: true,
            clients
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener los clientes",
            error: error.message
        });
    }
}

export const createUser = async (req = request, res = response) => {
    const data = req.body;

    try {
        
        const existingUser = await User.findOne({
            $or: [{ username: data.username }, { email: data.email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'El correo o nombre de usuario ya están registrados. Por favor, ingrese otro diferente.'
            });
        }
        
        const encryptedPassword = await hash (data.password);

        const user = await User.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
            role: data.role,
            cart: [],
            purchaseHistory: [],
            invoices: [],
            state: true
        });

        return res.status(201).json({
            message: "Usuario registrado exitosamente",
            userDetails: {
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            msg: "Error al Crear el usuario",
            error: error.message
        }); 
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, email, password, role, ...data } = req.body;

        if (email || password) {
            return res.status(400).json({
                success: false,
                msg: "No puedes actualizar el email o la contraseña desde esta ruta para proteger la integridad del usuario"
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        if (role && !["ADMIN_ROLE", "CLIENT_ROLE"].includes(role)) {
            return res.status(400).json({
                success: false,
                msg: "Rol no válido. Debe ser ADMIN_ROLE o CLIENT_ROLE"
            });
        }

        Object.assign(user, data);

        if (role) user.role = role;

        await user.save();

        res.status(200).json({
            success: true,
            msg: "Usuario actualizado correctamente",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar el usuario",
            error: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(id, { state: false }, { new: true });

        const autheticatedUser = req.user;

        res.status(200).json({
            success: true,
            msg: "Usario desactivado",
            user,
            autheticatedUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al Desactivar Usuario",
            error
        })
    }   
}

export const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, email, password, role, ...data } = req.body;

        if (req.usuario._id.toString() !== id) {
            return res.status(403).json({
                success: false,
                msg: "No tienes permiso para actualizar este perfil."
            });
        }

        if (email || password) {
            return res.status(400).json({
                success: false,
                msg: "No puedes actualizar el email o la contraseña desde esta ruta."
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        if (role && role !== user.role) {
            return res.status(400).json({
                success: false,
                msg: "No puedes cambiar el rol de usuario."
            });
        }

        Object.assign(user, data);

        await user.save();

        res.status(200).json({
            success: true,
            msg: "Usuario actualizado correctamente",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar el usuario",
            error: error.message
        });
    }
};

export const deleteUserAccount = async (req, res) => {
    const { _id: userId } = req.usuario;  
    try {
        if (userId !== req.params.id) {
            return res.status(403).json({
                success: false,
                msg: "No tienes permiso para eliminar esta cuenta."
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        user.state = false;

        await user.save();

        res.status(200).json({
            success: true,
            msg: "Cuenta eliminada correctamente. Usuario desactivado.",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al eliminar la cuenta",
            error: error.message
        });
    }
};
