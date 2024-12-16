import { Router } from "express";
import controller from "./container.controller";
import asyncHandler from "../../handlers/async";
import authenticate from "../../middlewares/authenticate";

const router = Router();
router.post("/verify_token" , authenticate , asyncHandler(controller.test_token));
router.post("/booked_container",  asyncHandler(controller.booking_container));
router.post("/payment_container", asyncHandler(controller.payment_container));
router.put(
  "/booked_container/:id",
  asyncHandler(controller.booking_container_tracking)
);

router.get(
  "/container_client_history",
  authenticate ,
  asyncHandler(controller.get_all_client_booking)
);

router.get(
  "/all_orders_container",
  asyncHandler(controller.get_all_orders_container)
);

router.post(
  "/filter_container_orders",
  asyncHandler(controller.get_filter_containers)
);
router.post(
  "/update_client_container_installment",
  controller.update_installment_payment
);
router.post("/tracking_container", asyncHandler(controller.tracking_container));
export default router;
