import {Router} from 'express';
import controller from './controller';

const router = Router();

router.post('/booked_container' ,  controller.booking_container);
router.post('/payment_container' , controller.payment_container);
router.put('/booked_container/:id', controller.booking_container_tracking);
router.get('/container_client_history' , controller.get_all_client_booking );


export default router;
