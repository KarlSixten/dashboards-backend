import { Router } from 'express';
import {
  getMetrics,
  getWeeklyCalls,
  getWeeklyContactedLeads,
  getWeeklyTopCallers,
  getWeeklyValueWon,
  getYearlyValueWon
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
    const [weeklyCalls, weeklyContactedLeads, weeklyTopCallers, weeklyValueWon, yearlyValueWon] = await Promise.all([
      getWeeklyCalls(),
      getWeeklyContactedLeads(),
      getWeeklyTopCallers(),
      getWeeklyValueWon(),
      getYearlyValueWon()
    ]);

    res.send({
      data: {
        weeklyCalls,
        weeklyContactedLeads,
        weeklyTopCallers,
        weeklyValueWon,
        yearlyValueWon
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).send({ error: "Failed to fetch dashboard data" });
  }
});

export default router;