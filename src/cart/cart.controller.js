import Cart from "./cart.model.js";
import Product from "../products/product.model.js";
import User from "../users/user.model.js";

export const addProductToCart = async (req, res) => {
    const { _id: userId } = req.usuario;
    const { productId, quantity } = req.body;

    try {
        // Verificar si el producto existe y tiene suficiente stock
        const product = await Product.findById(productId);
        if (!product || !product.state || product.stock < quantity) {
            return res.status(404).json({ msg: "Producto no disponible" });
        }

        // Buscar un carrito activo del usuario, si no existe, crear uno nuevo
        let cart = await Cart.findOne({ user: userId, status: { $ne: "COMPLETED" } });

        // Si el carrito está en estado "CANCELLED", se crea un nuevo carrito
        if (cart && cart.status === "CANCELLED") {
            cart = new Cart({ user: userId, items: [] });
        }

        // Si no se encuentra un carrito, creamos uno nuevo
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Validar si el carrito está en estado "COMPLETED" o "CANCELLED"
        if (cart.status === "COMPLETED" || cart.status === "CANCELLED") {
            return res.status(400).json({ msg: "Este carrito no se puede modificar" });
        }

        // Verificar si el producto ya existe en el carrito
        const item = cart.items.find(item => item.product.toString() === productId);

        if (item) {
            // Si el producto ya está en el carrito, actualizar la cantidad
            const newQuantity = item.quantity + quantity;
            if (newQuantity > product.stock) {
                return res.status(400).json({ msg: `No puedes agregar más de ${product.stock} unidades` });
            }
            item.quantity = newQuantity;
        } else {
            // Si el producto no está en el carrito, agregarlo
            cart.items.push({ product: productId, quantity, price: product.price });
        }

        // Actualizar el stock del producto
        product.stock -= quantity;
        if (product.stock === 0) {
            product.state = false; // Producto fuera de stock
        }

        // Guardar el producto y el carrito
        await product.save();
        await cart.save();

        // Actualizar el campo 'cart' en el modelo 'User' si el carrito no está ya asociado
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

        // Si el carrito no está en la lista de carritos del usuario, lo agregamos
        if (!user.cart.includes(cart._id)) {
            user.cart.push(cart._id);
            await user.save();
        }

        res.status(200).json({ msg: "Producto agregado al carrito", cart });
    } catch (error) {
        res.status(500).json({ msg: "Error al agregar producto al carrito", error: error.message });
    }
};
