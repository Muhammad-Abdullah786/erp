import { Router } from "express";
import controller from "./controller";
import authenticate from "../../middlewares/authenticate";

const router = Router();
router.post("/booked_container", authenticate, controller.booking_container);
router.post("/payment_container", controller.payment_container);
router.put("/booked_container/:id", controller.booking_container_tracking);
router.get(
  "/container_client_history",
  authenticate,
  controller.get_all_client_booking
);
router.get("/all_orders_container", controller.get_all_orders_container);
router.post("/filter_container_orders", controller.get_filter_containers);
router.post(
  "/update_client_container_installment",
  controller.update_installment_payment
);

export default router;
