import { Application } from "express";
import { API_ROOT } from "../constant/application";

import General from "./router";
import authRoutes from "./user/authentication";
import userManagementRoutes from "./user/management";
import container_router from "../APIs/container/routes";
import employeRouter from "../APIs/employeedata/router";
import adminRoutes from "../APIs/Admin/routes/Admin.routes";
import authenticate from "../middlewares/authenticate";

const App = (app: Application) => {
  app.use(`${API_ROOT}`, General);
  app.use(`${API_ROOT}`, authRoutes);
  app.use(`${API_ROOT}/user`, userManagementRoutes);
  app.use(`${API_ROOT}/employee`, employeRouter);
  app.use(`${API_ROOT}/container`, container_router);
<<<<<<< HEAD
  app.use(`${API_ROOT}/admin`, authenticate, adminRoutes);
=======
  app.use(`${API_ROOT}/admin`, authenticate,adminRoutes);
>>>>>>> 8212b5bd73cab692a6cb1939a7d3550f900a10df
};

export default App;
