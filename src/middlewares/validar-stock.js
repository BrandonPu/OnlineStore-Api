const checkProductStock = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        // Encuentra el producto en la base de datos usando el productId
        const product = await Product.findById(productId);

        // Si el producto no existe, devuelve un error
        if (!product) {
            return res.status(404).json({ success: false, msg: "Producto no encontrado" });
        }

        // Verifica si el stock disponible es suficiente
        if (product.stock <= 0) {
            return res.status(400).json({ success: false, msg: "No hay stock disponible de este producto" });
        }

        // Si el stock es menor que la cantidad solicitada, devuelve un error diciendo cuántos quedan
        if (product.stock < quantity) {
            return res.status(400).json({ success: false, msg: `Solo quedan ${product.stock} unidades disponibles` });
        }

        // Si la validación pasa, pasa al siguiente middleware o controlador
        next();
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error al verificar el stock", error: error.message });
    }
};
