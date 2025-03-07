import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      validate: {
        validator: (value) => value > 0,
        message: "El precio debe ser mayor a 0",
      },
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      default: 0,
      validate: {
        validator: (value) => value >= 0,
        message: "El stock no puede ser negativo",
      },
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La categoría es obligatoria"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    state: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Product", ProductSchema);
