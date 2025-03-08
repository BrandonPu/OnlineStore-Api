import Cart from "../cart/cart.model.js";
import User from "../users/user.model.js";
import Product from "../products/product.model.js";
import Invoice from "./invoice.model.js";

export const getUserInvoices = async (req, res) => {
    try {
        // Obtenemos todas las facturas del usuario autenticado
        const invoices = await Invoice.find({ user: req.usuario._id }).populate("items.product");

        if (!invoices || invoices.length === 0) {
            return res.status(404).json({ message: "No se encontraron facturas para este usuario." });
        }

        // Devolvemos las facturas con los productos detallados
        res.status(200).json({ message: "Facturas encontradas", invoices });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las facturas", error: error.message });
    }
};

export const getInvoiceDetails = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        // Encontramos la factura especificada por su ID y cargamos los productos
        const invoice = await Invoice.findById(invoiceId).populate("items.product");

        if (!invoice) {
            return res.status(404).json({ message: "Factura no encontrada." });
        }

        // Verificamos que el usuario que realiza la solicitud sea el propietario de la factura
        if (invoice.user.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ message: "No tienes permiso para ver esta factura." });
        }

        // Devolvemos la factura con los productos detallados
        res.status(200).json({ message: "Factura encontrada", invoice });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los detalles de la factura", error: error.message });
    }
};

export const completePurchase = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cartId).populate("items.product");

        if (!cart || cart.status !== "ACTIVE") {
            return res.status(400).json({ message: "Carrito no encontrado o ya está cerrado." });
        }

        if (cart.user.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({
                message: "No tienes permiso para completar esta compra. Solo el propietario del carrito puede hacerlo.",
            });
        }

        const invoice = new Invoice({
            user: req.usuario._id,
            items: cart.items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.subtotal,
            })),
            total: cart.total,
            status: "PAID",
            paymentMethod: req.body.paymentMethod,
        });

        await invoice.save();

        await User.findByIdAndUpdate(
            req.usuario._id,
            { $push: { invoices: invoice._id } },
            { new: true }
        );

        cart.status = "CANCELLED";
        await cart.save();

        res.status(200).json({ message: "Compra completada", invoice });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al completar la compra", error: error.message });
    }
};


export const editInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const invoice = await Invoice.findById(invoiceId).populate("items.product");

        if (!invoice) {
            return res.status(404).json({ message: "Factura no encontrada." });
        }

        for (let existingItem of invoice.items) {
            const product = await Product.findById(existingItem.product._id);
            const newItem = req.body.items ? req.body.items.find(item => item.product.toString() === existingItem.product.toString()) : null;

            if (!newItem) {
                product.stock += existingItem.quantity;
            } else {
                const quantityDifference = newItem.quantity - existingItem.quantity;

                if (quantityDifference < 0) {
                    product.stock += Math.abs(quantityDifference);
                } else if (quantityDifference > 0) {
                    if (product.stock < quantityDifference) {
                        return res.status(400).json({
                            message: `No hay suficiente stock para el producto: ${product.name}`,
                        });
                    }
                    product.stock -= quantityDifference;
                }
            }

            await product.save(); 
        }

        if (req.body.items) {
            invoice.items = req.body.items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.subtotal,
            }));
        }

        if (req.body.total) {
            invoice.total = req.body.total;
        }

        if (req.body.status) {
            invoice.status = req.body.status;
        }

        await invoice.save();

        res.status(200).json({ message: "Factura actualizada", invoice });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al editar la factura", error: error.message });
    }
};

export const getPurchaseHistory = async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.usuario._id }).populate("items.product");

        if (!invoices || invoices.length === 0) {
            return res.status(404).json({ message: "No se encontraron compras anteriores." });
        }

        res.status(200).json({
            message: "Historial de compras encontrado",
            invoices: invoices.map(invoice => ({
                _id: invoice._id,
                total: invoice.total,
                status: invoice.status,
                date: invoice.createdAt,
                items: invoice.items.map(item => ({
                    product: item.product.name,
                    quantity: item.quantity,
                    price: item.price,
                    subtotal: item.subtotal,
                })),
            })),
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el historial de compras", error: error.message });
    }
};
