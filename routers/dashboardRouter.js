import { Router } from 'express';
import {
  getMetrics,
  getWeeklyCalls,
  getWeeklyContactedLeads,
  getWeeklyTopCallers
} from '../util/closeService.js';

const router = Router();

router.get("/api/metrics", async (req, res) => {
  try {
    const metrics = await getMetrics();
    res.send({ data: metrics });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).send({ error: "Failed to fetch metrics" });
  }
});

router.get("/api/dashboard-data", async (req, res) => {
  try {
    const [weeklyCalls, weeklyContactedLeads, weeklyTopCallers] = await Promise.all([
      getWeeklyCalls(),
      getWeeklyContactedLeads(),
      getWeeklyTopCallers()
    ]);

    res.send({
      data: {
        weeklyCalls,
        weeklyContactedLeads,
        weeklyTopCallers
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).send({ error: "Failed to fetch dashboard data" });
  }
});

export default router;