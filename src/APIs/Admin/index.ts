<<<<<<< HEAD
import dotenv from "dotenv";


import express from "express";

import authRoutes from "./routes/Admin.routes";
=======
import dotenv from 'dotenv';


import express from 'express';

import authRoutes from './routes/Admin.routes';
>>>>>>> main

dotenv.config();  // Load environment variables

const app = express();

app.use(express.json());

<<<<<<< HEAD
app.use("/api/auth",authRoutes)
=======
app.use('/api/auth',authRoutes)
>>>>>>> main

