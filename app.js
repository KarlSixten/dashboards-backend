import 'dotenv/config';

import express from 'express';
const app = express();

import cors from 'cors';
app.use(cors());

import router from './routers/dashboardRouter.js';
app.use(router);

const PORT = 8080;
app.listen(PORT, () => console.log('Server is running on port:', PORT));