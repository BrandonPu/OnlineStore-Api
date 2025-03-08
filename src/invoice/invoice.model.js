import { Schema, model } from "mongoose";

const InvoiceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: false,
        },
        subtotal: {
          type: Number,
          required: false,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PAID", "PENDING", "CANCELLED"],
      default: "PENDING",
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

export default model("Invoice", InvoiceSchema);