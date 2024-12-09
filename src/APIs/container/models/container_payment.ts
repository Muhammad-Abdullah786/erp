<<<<<<< HEAD
import { Schema, model, Document } from "mongoose";
=======
import { Schema, model, Document } from 'mongoose';
>>>>>>> main

interface PaymentSchedule {
  installment_number: number;
  due_date: Date;
  amount: number;
<<<<<<< HEAD
  status: "pending" | "paid";
=======
  status: 'pending' | 'paid';
>>>>>>> main
}

interface Payment extends Document {
  user_id  : Schema.Types.ObjectId;
  booking_id: Schema.Types.ObjectId;
  total_amount: number;
  down_payment: number;
  remaining_balance: number;
  installmentDetails: PaymentSchedule[];
<<<<<<< HEAD
  remaining_amount : Number;
=======
  remaining_amount : number;
>>>>>>> main
  created_at: Date;
}

const PaymentSchema = new Schema<Payment>({
  user_id : {
    type : Schema.Types.ObjectId,
    required : true
  },
  booking_id: {
    type: Schema.Types.ObjectId,
<<<<<<< HEAD
    ref: "Container", // Reference to your container booking model
=======
    ref: 'Container', // Reference to your container booking model
>>>>>>> main
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  installmentDetails : [
    {
      installment_number :  {
        type  : Number,
      },
      amount : {
        type  : Number,
      },
      status : {
         type : String,
         default : 'pending'
      },
      due_date: {
        type: Date,
        default: function (this  : any) {
          // If status is 'paid', return undefined (no due date)
          if (this.status === 'paid') return undefined;
          // Else, set the due date to 1 month from the current date
          return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 1 month from current date
        }
      }
    }
  ],
  remaining_amount : {
    type : Number,
},
},{timestamps : true});

<<<<<<< HEAD
const PaymentModel = model<Payment>("Payment", PaymentSchema);
=======
const PaymentModel = model<Payment>('Payment', PaymentSchema);
>>>>>>> main

export default PaymentModel;
