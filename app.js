import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import router from './routers/dashboardRouter.js';

const app = express();

app.use(router);

const PORT = 8080;
app.listen(PORT, () => console.log('Server is running on port:', PORT));