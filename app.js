import 'dotenv/config';

import express from 'express';
const app = express();

import cors from 'cors';
app.use(cors());

import router from './routers/dashboardRouter.js';
app.use(router);

import path from 'path';

app.use(express.static(path.resolve('../dashboards-frontend/dist/')));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.resolve('../dashboards-frontend/dist/index.html'));
});

const PORT = 8080;
app.listen(PORT, () => console.log('Server is running on port:', PORT));