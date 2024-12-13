import service from "../service/container.service";
import axios from "axios";
import logger from "../../../handlers/logger";
import PaymentModel from "../models/container_payment";
const Stripe = require("stripe");
const stripe = new Stripe(
  "sk_test_51QPhZID0nPeKrajIN2Adi7XnUIHz52kAKBkTO9P2nygfQstOgnSLeMgnKTi85nemDr4j2E07YszwIrLXOgye34ip00vWUaKZpe"
);

// export default {
//   payment_stripe: async (body: any) => {
//     try {
//       const { down_payment } = body;
//       // Create a Payment intent with Stripe
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: Math.round(down_payment * 100), // Stripe accepts amounts in cents
//         currency: "usd", // Adjust currency as needed
//         automatic_payment_methods: {
//           enabled: true, // Enables automatic handling for payment methods
//         },
//       });
//       logger.info(
//         `this is the payment indtent` + JSON.stringify(paymentIntent)
//       );
//       if (!paymentIntent) {
//         throw new Error("Failed to create payment intent");
//       }
//       return paymentIntent;
//     } catch (e) {
//       logger.error(e);
//       throw error;
//     }
//   },

//    createPaymentOrder :async (data: {
//     user_uniqueName: string;
//     phoneNumber: number;
//     total_amount: number;
//     down_payment: number;
//   }) => {
//     try {
//       const { user_uniqueName, phoneNumber, total_amount, down_payment } = data;

//       const remaining_balance = total_amount - down_payment;

//       const paymentOrder = new PaymentModel({
//         user_uniqueName,
//         phoneNumber,
//         total_amount,
//         down_payment,
//         remaining_balance,
//         remaining_amount: remaining_balance,
//         installmentDetails: [
//           {
//             installment_number: 1,
//             amount: down_payment,
//             status: "pending",
//           },
//           {
//             installment_number: 2,
//             amount: remaining_balance,
//             status: "pending",
//           },
//         ],
//       });

//       const savedPayment = await paymentOrder.save();

//       if (!savedPayment) {
//         throw new Error("Failed to create payment order");
//       }

//       logger.info("Payment order created successfully", {
//         meta: savedPayment,
//       });

//       return savedPayment;
//     } catch (error) {
//       logger.error("Error creating payment order", { meta: error });
//       throw error;
//     }
//   },

//   fiter_orders: async (body: any) => {
//     try {
//       const filters: Record<string, any> = {};
//       const {
//         container_type,
//         weight,
//         "containers.size": containerSize,
//         price,
//         handle_type,
//         tracking_status,
//         "installmentDetails.status": installmentStatus,
//       } = body;

//       // Add filters dynamically if they exist in the request query
//       if (container_type) filters.container_type = container_type;
//       if (weight) filters.weight = Number(weight); // Ensure correct type
//       if (containerSize) filters["containers.size"] = containerSize;
//       if (price) filters.price = Number(price);
//       if (handle_type) filters.handle_type = handle_type;
//       if (tracking_status) filters.tracking_status = tracking_status;
//       if (installmentStatus)
//         filters["installmentDetails.status"] = installmentStatus;

//       if (body.startDate || body.endDate) {
//         filters.created_at = {};
//         if (body.startDate) {
//           filters.created_at.$gte = new Date(body.startDate); // Greater than or equal to startDate
//         }
//         //   if (body.endDate) {
//         //     filters.created_at.$lte = new Date(body.endDate); // Less than or equal to endDate
//         //   }
//       }

//       const get_filter = await service.find_filter_orders(filters);
//       return get_filter;
//     } catch (e: any) {
//       console.log(e);
//       throw error;
//     }
//   },
// };

export default {
  payment_stripe: async (body: any) => {
    try {
      const { down_payment } = body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(down_payment * 100),
        currency: "usd",
        automatic_payment_methods: { enabled: true },
      });

      logger.info(`Payment intent created: ${JSON.stringify(paymentIntent)}`);

      if (!paymentIntent) {
        throw new Error("Failed to create payment intent");
      }
      return paymentIntent;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  },

  createPaymentOrder: async (data: {
    user_uniqueName: string;
    phoneNumber: number;
    total_amount: number;
    down_payment: number;
  }) => {
    try {
      const { user_uniqueName, phoneNumber, total_amount, down_payment } = data;
      const remaining_balance = total_amount - down_payment;

      const paymentOrder = new PaymentModel({
        user_uniqueName,
        phoneNumber,
        total_amount,
        down_payment,
        remaining_balance,
        remaining_amount: remaining_balance,
        installmentDetails: [
          {
            installment_number: 1,
            amount: down_payment,
            status: "pending",
          },
          {
            installment_number: 2,
            amount: remaining_balance,
            status: "pending",
          },
        ],
      });

      const savedPayment = await paymentOrder.save();

      if (!savedPayment) {
        throw new Error("Failed to create payment order");
      }

      logger.info("Payment order created successfully", { meta: savedPayment });

      return savedPayment;
    } catch (error) {
      logger.error("Error creating payment order", { meta: error });
      throw error;
    }
  },

  fiter_orders: async (body: any) => {
    try {
      const filters: Record<string, any> = {};
      const {
        container_type,
        weight,
        "containers.size": containerSize,
        price,
        handle_type,
        tracking_status,
        "installmentDetails.status": installmentStatus,
      } = body;

      if (container_type) filters.container_type = container_type;
      if (weight) filters.weight = Number(weight);
      if (containerSize) filters["containers.size"] = containerSize;
      if (price) filters.price = Number(price);
      if (handle_type) filters.handle_type = handle_type;
      if (tracking_status) filters.tracking_status = tracking_status;
      if (installmentStatus)
        filters["installmentDetails.status"] = installmentStatus;

      if (body.startDate || body.endDate) {
        filters.created_at = {};
        if (body.startDate) filters.created_at.$gte = new Date(body.startDate);
        if (body.endDate) filters.created_at.$lte = new Date(body.endDate);
      }

      const get_filter = await service.find_filter_orders(filters);
      return get_filter;
    } catch (e: any) {
      logger.error("Error in filtering orders", { meta: e });
      throw e;
    }
  },

  get_device_id: async () => {
    try {
      const get_device_id = await axios.get(
        `https://flespi.io/gw/devices/all`,
        {
          headers: {
            Authorization: `FlespiToken o2fTkbO5RlrtKDlID7bc6sIibkyXQnqaNT5Br1Xtlb3Ufis06SIDE0weYKY6Dh8A`,
          },
        }
      );
      return get_device_id.data;
    } catch (e: any) {
      console.log(e);
      throw e;
    }
  },
};
