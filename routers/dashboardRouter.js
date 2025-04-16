import { Router } from 'express';
import {
  getMetrics,
  getWeeklyCalls,
  getWeeklyContactedLeads,
  getWeeklyTopCallers,
  getWeeklyValueWon,
  getYearlyValueWon,
  getWeeklyEmailsSent,
  getWeeklyTopEmailers
} from '../util/closeService/data.js';
import { groups } from '../util/closeService/groups.js';

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
    const [weeklyCalls, weeklyContactedLeads, weeklyTopCallers, weeklyValueWon, yearlyValueWon, weeklyEmailsSent, weeklyTopEmailers] = await Promise.all([
      getWeeklyCalls(),
      getWeeklyContactedLeads(),
      getWeeklyTopCallers(),
      getWeeklyValueWon(),
      getYearlyValueWon(),
      getWeeklyEmailsSent(),
      getWeeklyTopEmailers()
    ]);

    res.send({
      data: {
        weeklyCalls,
        weeklyContactedLeads,
        weeklyTopCallers,
        weeklyValueWon,
        yearlyValueWon,
        weeklyEmailsSent,
        weeklyTopEmailers
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).send({ error: "Failed to fetch dashboard data" });
  }
});

router.get("/api/groups", async (req, res) => {
    res.send(groups);
})

export default router;