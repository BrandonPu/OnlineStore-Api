import Product from "../products/product.model.js";
import Category from "../categories/categories.model.js";
import User from "../users/user.model.js";

export const getProductsCategoy = async (req, res) => {
    try {
        if (!req.usuario || !req.usuario.name) {
            return res.status(400).json({
                message: "No se encontró el usuario en el token",
            });
        }

        const userName = req.usuario.name;

        const products = await Product.find({ state: true })
            .populate('category', 'name');  

        if (products.length === 0) {
            return res.status(404).json({
                message: "No hay productos disponibles.",
            });
        }

        const productsByCategory = {};

        products.forEach(product => {
            if (!productsByCategory[product.category.name]) {
                productsByCategory[product.category.name] = [];
            }

            productsByCategory[product.category.name].push({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                sold: product.sold,
            });
        });

        res.status(200).json({
            success: true,
            greeting: `Bienvenido ${userName} veamos`,
            message: "< ------------- Productos De OnlineStorePu ---------------- >.",
            productsByCategory
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los productos.",
            error: error.message,
        });
    }
}

export const getTopSellingProducts = async (req, res) => {
    try {

        if (!req.usuario || !req.usuario.name) {
            return res.status(400).json({
                message: "No se encontró el usuario en el token",
            });
        }

        const userName = req.usuario.name;

        const topSellingProducts = await Product.find({ state: true }) 
            .sort({ sold: -1 }) 
            .limit(10) 
            .populate('category', 'name');  

        if (topSellingProducts.length === 0) {
            return res.status(404).json({
                message: "No hay productos vendidos",
            });
        }

        const simplifiedProducts = topSellingProducts.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            sold: product.sold,
            stock: product.stock,
            category: product.category.name,  
        }));

        res.status(200).json({
            success: true,
            greeting: `Bienvenido ${userName} veamos`,
            title: "< ---------- Productos Más Vendidos de OnlineStorePu ------------- >", 
            products: simplifiedProducts 
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los productos más vendidos",
            error: error.message,
        });
    }
};

export const searchProductsByName = async (req, res) => {
    const { name } = req.query; 

    if (!name) {
        return res.status(400).json({
            message: "Por favor, ingrese un nombre para buscar.",
        });
    }

    try {
        const products = await Product.find({
            name: { $regex: name, $options: 'i' },
            state: true,  
        });

        if (products.length === 0) {
            return res.status(404).json({
                message: "No se encontraron productos con ese nombre.",
            });
        }

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({
            message: "Hubo un error al buscar los productos.",
            error: error.message,
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ state: true });

        if (categories.length === 0) {
            return res.status(404).json({
                message: "No hay categorías disponibles",
            });
        }

        res.status(200).json({
            success: true,
            categories,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener las categorías",
            error: error.message,
        });
    }
};
export const getProductsByCategoryName = async (req, res) => {
    const { categoryName } = req.params; 

    try {
        const category = await Category.findOne({ name: categoryName, state: true });

        if (!category) {
            return res.status(404).json({
                message: "Categoría no encontrada o desactivada",
            });
        }

        const products = await Product.find({ category: category._id, state: true });

        if (products.length === 0) {
            return res.status(404).json({
                message: "No hay productos disponibles en esta categoría",
            });
        }

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los productos filtrados por categoría",
            error: error.message,
        });
    }
};
