import { Application } from "express";
import { API_ROOT } from "../constant/application";

import General from "./router";
import authRoutes from "./user/authentication";
import userManagementRoutes from "./user/management";
import Router from "./employeedata/router/router1";

const App = (app: Application) => {
  app.use(`${API_ROOT}`, General);
  app.use(`${API_ROOT}`, authRoutes);
  app.use(`${API_ROOT}/user`, userManagementRoutes);
  app.use(`${API_ROOT}/register`, Router);
  app.use(`${API_ROOT}/loginn`, Router);
  app.use(`${API_ROOT}/GetAllEmploye`, Router);
  app.use(`${API_ROOT}/GetEmployeByiD`, Router);
  app.use(`${API_ROOT}/UpdateEmployeByiD`, Router);
  app.use(`${API_ROOT}/DeleteEmployeByiD`, Router);
  app.use(`${API_ROOT}/ResetEmail`, Router);
  app.use(`${API_ROOT}/ResetPassword`, Router);

  app.use(`${API_ROOT}/Email`, Router);
  app.use(`${API_ROOT}/Welcome`, Router);
};

export default App;
