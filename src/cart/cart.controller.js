import Cart from "./cart.model.js";
import Product from "../products/product.model.js";
import User from "../users/user.model.js";

export const addProductToCart = async (req, res) => {
    const { _id: userId } = req.usuario;
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product || !product.state || product.stock < quantity) {
            return res.status(404).json({ msg: "Producto no disponible" });
        }

        let cart = await Cart.findOne({ user: userId, status: { $ne: "COMPLETED" } }) || new Cart({ user: userId, items: [] });
        if (cart.status === "COMPLETED" || cart.status === "CANCELLED") return res.status(400).json({ msg: "Este carrito no se puede modificar" });

        const item = cart.items.find(item => item.product.toString() === productId);
        if (item) {
            const newQuantity = item.quantity + quantity;
            if (newQuantity < product.stock) return res.status(400).json({ msg: `No puedes agregar más de ${product.stock} unidades` });
            item.quantity = newQuantity;
        } else {
            cart.items.push({ product: productId, quantity, price: product.price });
        }

        product.stock -= quantity;
        if (product.stock === 0) product.state = false;

        await product.save();
        await cart.save();

        // Actualizar el campo 'cart' en el modelo 'User'
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

        // Si el carrito no está ya en la lista de carritos del usuario, lo agregamos
        if (!user.cart.includes(cart._id)) {
            user.cart.push(cart._id);
            await user.save();
        }

        res.status(200).json({ msg: "Producto agregado al carrito", cart });
    } catch (error) {
        res.status(500).json({ msg: "Error al agregar producto al carrito", error: error.message });
    }
};
