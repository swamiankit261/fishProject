import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
    {
        amount: {
            type: Number, required: [true, "amount must are required."],

        },
        paymentId: {
            type: String, required: [true, "UPI ref NO:/transaction ID must are required."],
            unique: [true, "UPI ref NO:/transaction ID must be unique."],
        },
        upiId: {
            type: String, required: [true, "UPI ID must be required."],

        },
        phoneNo: {
            type: Number, required: [true, "phoneNo must be required."],
            validate: {
                validator: function (value) {
                    return /^[0-9]{10}$/.test(value);
                },
                message: props => `${props.value} is not a valid phone number.!`
            }
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, "customerId must be required."],

        },
        status: {
            type: String,
            enum: {
                values: ['Pending', 'Completed', 'Failed', "Refunded"],
                message: '{VALUE} is not a valid status'
            },
            default: 'Pending'

        }

    }, { timestamps: true }
);

export default mongoose.model('Payment', PaymentSchema);