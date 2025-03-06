import { Schema, model } from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "El campo de nombre es Obligatorio"],
        },
        surname: {
            type: String,
            required: [true, "El campo de apellido es Obligatorio"],
        },
        username: {
            type: String,
            required: [true, "El campo de nombre de usuario es Obligatorio"],
            unique: true,
        },
        email: {
            type: String,
            required: [true, "El email es Obligatorio"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "La contraseña es Obligatoria"],
        },
        role: {
            type: String,
            default: "CLIENT_ROLE",
            enum: ["ADMIN_ROLE", "CLIENT_ROLE"],
        },
        cart: [{
            type: Schema.Types.ObjectId,
            ref: "Cart",
        }],
        purchaseHistory: [{
            type: Schema.Types.ObjectId,
            ref: "PurchaseHistory",
        }],
        invoices: [{
            type: Schema.Types.ObjectId,
            ref: "Invoice",
        }],
        state: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model("User", UserSchema);