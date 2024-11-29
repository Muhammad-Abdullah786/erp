import { Application } from 'express';
import { API_ROOT } from '../constant/application'

import General from './router'
import authRoutes from './user/authentication'
import userManagementRoutes from './user/management'
import container_router from '../APIs/container/routes';

const App = (app: Application) => {
    app.use(`${API_ROOT}`, General);
    app.use(`${API_ROOT}`, authRoutes);
    app.use(`${API_ROOT}/user`, userManagementRoutes);
    app.use(`${API_ROOT}/container`, container_router);
}

export default App
