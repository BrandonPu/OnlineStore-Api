import { Schema, model } from "mongoose";

const CartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                price: {
                    type: Number,
                    required: true
                },
                subtotal: {
                    type: Number,
                    default: 0
                }
            }
        ],
        total: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ["ACTIVE", "PENDING", "COMPLETED", "CANCELLED"],
            default: "ACTIVE"
        },
        state: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

CartSchema.pre("save", function (next) {
    let updatedTotal = 0;

    this.items.forEach(item => {
        if (!item.subtotal || item.isModified("quantity")) {
            item.subtotal = item.quantity * item.price;
        }

        updatedTotal += item.subtotal;
    });

    this.total = updatedTotal;
    next();
});

export default model("Cart", CartSchema);
