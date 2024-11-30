import {Router} from 'express';
import controller from './controller';
import authenticate from '../../middlewares/authenticate';

const router = Router();

router.post('/booked_container' , authenticate ,   controller.booking_container);
router.post('/payment_container' , controller.payment_container);
router.put('/booked_container/:id', controller.booking_container_tracking);
router.get('/container_client_history' , authenticate ,  controller.get_all_client_booking );


export default router;
