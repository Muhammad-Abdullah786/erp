const Contaier_BD = require("../models/container_models");
import PaymentModel from "../models/container_payment";

export default {
  save_book_conatiner: async (body: any, user_id: any) => {
    try {
      console.log("userdi from service", user_id);
      const newBody = {
        sender_id: user_id,
        ...body,
      };
      console.log(newBody);
      const container = new Contaier_BD(newBody);
      const save_cont = await container.save();
      if (!save_cont) {
        throw new Error("Failed to book container");
      }
      const payment_model = new PaymentModel({
        user_id: user_id,
        booking_id: container._id,
        total_amount: container.price,
        installmentDetails: body.installmentDetails || [],
        remaining_amount: container.remaining_amount,
      });
      if (!payment_model) {
        throw new Error("Failed to save pamyment model");
      }
      await payment_model.save();
      return save_cont;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  update_book_conatiner_tracking: async (body: any, id: any) => {
    try {
      const { tracking_status, tracking_stages } = body;
      const container = await Contaier_BD.findById(id);
      if (!container) {
        throw new Error("Container not found");
      }

      // Update the tracking status and tracking stages
      container.tracking_status = tracking_status || container.tracking_status;

      // If tracking stages are provided, update them as well
      if (tracking_stages) {
        container.tracking_stages = {
          pickup: tracking_stages.pickup || { status: false, timestamp: null },
          inTransit: tracking_stages.inTransit || {
            status: false,
            timestamp: null,
          },
          delivered: tracking_stages.delivered || {
            status: false,
            timestamp: null,
          },
        };
      }

      // Save the updated container
      const updated = await container.save();
      return updated;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  get_container_details: async (user_id: any) => {
    try {
      console.log(user_id);
      const get_data = await Contaier_BD.find({ sender_id: user_id });
      if (!get_data) {
        throw new Error(`No Contaier History `);
      }
      return get_data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
};
