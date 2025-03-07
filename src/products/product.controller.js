import Product from "./product.model.js";
import Category from "../categories/categories.model.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ state: true }).populate('category');

        if (products.length === 0) {
            return res.status(404).json({ message: 'No hay productos disponibles' });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Error al Encontrar el producto',
        });
    }
}

export const getProductsById = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, state: true }).populate('category');
        
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado o desactivado' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Error al Encontrar el producto',
        });
    }
}

export const getProductsInactive = async (req, res) => {
    try {
        const inactiveProducts = await Product.find({ state: false }).populate('category');

        if (inactiveProducts.length === 0) {
            return res.status(404).json({ message: 'No hay productos desactivados' });
        }

        res.status(200).json(inactiveProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Error al obtener los productos desactivados',
            error: error.message,
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const data = req.body;

        const existingCategory = await Category.findById(data.category);
        if (!existingCategory) {
            return res.status(400).json({
                message: 'La categoría especificada no existe.',
            });
        }

        const existingProduct = await Product.findOne({ name: data.name });
        if (existingProduct) {
            return res.status(400).json({
                message: 'Ya existe un producto con ese nombre.',
            });
        }

        const product = new Product({
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            category: data.category,
            sold: data.sold || 0,
        });

        await product.save();

        return res.status(201).json({
            message: 'Producto creado exitosamente.',
            productDetails: {
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                category: product.category,
                sold: product.sold,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Error al crear el producto.',
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if ((data.price && data.price <= 0) || (data.stock && data.stock < 0)) {
            return res.status(400).json({
                message: 'El precio debe ser mayor a 0 y el stock no puede ser negativo.',
            });
        }

        if (data.category && !(await Category.findById(data.category))) {
            return res.status(400).json({ message: 'La categoría especificada no existe.' });
        }

        if (data.hasOwnProperty('state')) {
            data.state = data.state === true || data.state === false ? data.state : undefined;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        return res.status(200).json({
            message: 'Producto actualizado exitosamente.',
            productDetails: updatedProduct,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar el producto.' });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndUpdate(id, { state: false }, { new: true });

        if (!product) {
            return res.status(404).json({
                success: false,
                msg: "Producto no encontrado"
            });
        }

        const authenticatedUser = req.user;

        return res.status(200).json({
            success: true,
            msg: "Producto desactivado correctamente",
            product,
            authenticatedUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error al desactivar el producto",
            error: error.message
        });
    }
};

export const getOutOfStockProducts = async (req, res) => {
    try {
      const outOfStockProducts = await Product.find({ stock: 0 });
  
      if (outOfStockProducts.length === 0) {
        return res.status(404).json({
          message: "No hay productos agotados",
        });
      }
  
      res.json(outOfStockProducts);

    } catch (error) {
      res.status(500).json({
        message: "Error al obtener productos agotados",
        error: error.message,
      });
    }
  };

  export const getTopSellingProducts = async (req, res) => {
    try {
      const topSellingProducts = await Product.find()
        .sort({ sold: -1 }) 
        .limit(10);
  
      if (topSellingProducts.length === 0) {
        return res.status(404).json({
          message: "No hay productos vendidos",
        });
      }
  
      res.json(topSellingProducts);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener los productos más vendidos",
        error: error.message,
      });
    }
  };
  