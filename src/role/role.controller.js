import Role from "./role.model.js";

export const createDefaultRoles = async () => {
    try {
        const roles = await Role.find();

        if (roles.length === 0) {
            const defaultRoles = [
                { role: 'ADMIN_ROLE' },
                { role: 'CLIENT_ROLE' }
            ];

            await Role.insertMany(defaultRoles);
            console.log("Roles por defecto creados: ADMIN_ROLE y CLIENT_ROLE");
        } else {
            console.log("Los roles ya están presentes en la base de datos.");
        }
    } catch (error) {
        console.error("Error al crear los roles:", error);
    }
};