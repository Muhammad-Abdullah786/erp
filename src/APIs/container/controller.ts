import { Request, Response } from "express";
import service from "./service/service";
import repo from "./repo/container_repo";

export default {
  booking_container: async (req: Request, res: Response) => {
    try {
      if (!req.body) {
        throw new Error("body not found");
      }
      const userid = req.authenticatedUser;
      console.log(userid);
      const container_data = await service.save_book_conatiner(
        req.body,
        userid._id
      );
      res
        .status(201)
        .json({
          message: "Container Booked Successfully",
          data: container_data,
        });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: error?.message });
    }
  },
  payment_container: async (req: Request, res: Response) => {
    try {
      const paymentverify = await repo.payment_stripe(req.body);
      res
        .status(200)
        .json({
          message: "Clien Payment Secret",
          data: paymentverify?.client_secret,
        });
    } catch (e: any) {
      res.status(400).json({ error: e?.message });
    }
  },
  booking_container_tracking: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!req.body) {
        throw new Error("body not found");
      }
      let a = await service.update_book_conatiner_tracking(req.body, id);
      if (a) {
        res
          .status(200)
          .json({ message: "Container Tracking Updated  Successfully" });
      }
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: error?.message });
    }
  },
  get_all_client_booking: async (req: Request, res: Response) => {
    try {
      const userid = req.authenticatedUser;
      console.log("user ", userid);
      let a = await service.get_container_details(userid._id);
      res.status(200).json({ message: "All Client Booking Details", data: a });
    } catch (e: any) {
      console.log(e);
      res.status(400).json({ error: e?.message });
    }
  },
};
