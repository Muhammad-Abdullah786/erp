import { Router } from 'express';
import {
  registerEmployee,
  loginEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,

} from './controller';
import authenticate from '../../middlewares/authenticate';

const router = Router();

router.route('/register').post(registerEmployee);
router.route('/login').post(loginEmployee);
router.route('/').get(getAllEmployees);
router.route('/:id').get(getEmployeeById);
router.route('/:id').get(getEmployeeById);
router.route('/:id').put(updateEmployeeById);
router.route('/:id').delete(deleteEmployeeById);


// TODO: need to add notification and modify container details when the checkpoints changes employe will check it and update it


router.route('/updateContainer/:id').post(authenticate,)


export default router;
