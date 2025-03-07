export const validarConfirmacion = (req, res, next) => {
    const confirmacion = req.header('confirmacion');

    if (confirmacion !== 'yes') {
        return res.status(400).json({
            success: false,
            msg: "Debe confirmar la acción de enviando 'confirmacion: yes' en los encabezados de la solicitud"
        });
    }

    next();
};