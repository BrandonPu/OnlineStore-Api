const checkProductStock = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, msg: "Producto no encontrado" });
        }

        if (product.stock <= 0) {
            return res.status(400).json({ success: false, msg: "No hay stock disponible de este producto" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ success: false, msg: `Solo quedan ${product.stock} unidades disponibles` });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error al verificar el stock", error: error.message });
    }
};
