import Category from "./categories.model.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        if (categories.length === 0) {
            return res.status(404).json({ message: "No hay categorías disponibles" });
        }

        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al traer todas las categorias",
            error: error.message
        });
    }
};

export const createCategoryDefault = async () => {
    try {
        
        const categoryExists = await Category.findOne({ name: 'General' });

        if (!categoryExists) {

            const defaultCategory = new Category({
                name: 'General',  
                description: 'Categoría general para los Productos'
            });

            await defaultCategory.save();

            console.log('Categoría predeterminada creada correctamente.');

        } else {
            console.log('La categoría predeterminada ya existe.');
        }
    } catch (error) {
        console.error('Error al crear la categoría predeterminada:', error);
    }
}

export const saveCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "La categoría ya existe" });
        }

        const category = new Category({ name, description });

        await category.save();

        res.status(200).json({
            success: true,
            msg: "Categoria Creado correctamente",
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al Crear la categoria",
            error: error.message
        });
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        category.state = false;
        await category.save();  

        res.status(200).json({
            success: true,
            msg: "Categoría desactivada correctamente", 
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al desactivar la categoría",
            error: error.message
        });
    }
};


export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description, state } = req.body; 

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        if (name) category.name = name;
        if (description) category.description = description;
        if (state !== undefined) category.state = state;

        await category.save();

        res.status(200).json({
            success: true,
            msg: "Categoria Actualizado correctamente",
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al Actualizar la categoria",
            error: error.message
        });
    }
};
