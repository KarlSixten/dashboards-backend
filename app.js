import express from 'express';

console.log("App started");

const app = express();

import router from './routers/dashboardRouter.js';
app.use(router);

const PORT = 8080;
app.listen(PORT, () => console.log('Server is running on port:', PORT));