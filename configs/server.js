'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from "../src/middlewares/validar-cant-peticiones.js";
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/users/user.routes.js";
import categoryRoutes from "../src/categories/categories.routes.js";
import productRoutes from "../src/products/product.routes.js";
import { createDefaultRoles } from '../src/role/role.controller.js';
import { createAdminUser } from '../src/auth/auth.controller.js';
import { createCategoryDefault } from '../src/categories/categories.controller.js';


const middlewares = (app) => {
    app.use(express.urlencoded({extended: false}));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) => {

    app.use("/onlineStorePu/v1/auth", authRoutes);
    app.use("/onlineStorePu/v1/user", userRoutes);
    app.use("/onlineStorePu/v1/category", categoryRoutes);
    app.use("/onlineStorePu/v1/product", productRoutes);

}

const conectarDB = async() => {
    try{
        await dbConnection();
        console.log("Conexión a la base de datos exitosa");
    }catch(error){
        console.error('Error conectando a la base de datos', error);
        process.exit(1);
    }
}

export const initServer = async() => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        await conectarDB();
        await createDefaultRoles();
        await createAdminUser();
        await createCategoryDefault();
        routes(app);
        app.listen(port);
        console.log(`Server running on port: ${port}`);
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }
}