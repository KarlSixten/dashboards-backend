import { Router } from 'express';
import { getMetrics, getWeeklyCalls, getWeeklyContactedLeads } from '../util/closeService.js'

const router = Router();

router.get("/api/metrics", async (req, res) => {
    const metrics = await getMetrics();

    res.send({ data: metrics })
})

router.get("/api/dashboard-data", async (req, res) => {
    const weeklyCalls = await getWeeklyCalls();
    const weeklyContactedLeads = await getWeeklyContactedLeads();

    res.send(
        {
            data:
            {
                weeklyCalls: weeklyCalls,
                weeklyContactedLeads: weeklyContactedLeads
            }
        }
    )
})

export default router;