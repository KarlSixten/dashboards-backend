import axios from 'axios';
import { Router } from 'express';
import { getCloseAuth } from '../auth/closeAuth.js';

const router = Router();

router.get("/api/metrics", async (req, res) => {
    try {
        const response = await axios.get("https://api.close.com/api/v1/report/activity/metrics/", getCloseAuth());
        res.send(response.data);
    } catch (error) {
        console.error("Failed to fetch calls from Close:", error.response?.status, error.response?.data || error.message);
        res.status(500).send({ error: "Failed to fetch data from Close" });
    }
})


router.get("/api/calls-this-week", async (req, res) => {
    try {
        const response = await axios.post("https://api.close.com/api/v1/report/activity/",
            {
                relative_range: 'this-week',
                type: 'overview',
                metrics: ["calls.outbound.all.count"]
            },
            getCloseAuth());
        const callsCount = response.data.aggregations.totals["calls.outbound.all.count"];
        res.send({ data: callsCount });
    } catch (error) {
        console.error("Failed to fetch calls from Close:", error.response?.status, error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch call data from Close" });
    }
});

router.get("/api/contacted-leads-this-week", async (req, res) => {
    try {
        const response = await axios.post("https://api.close.com/api/v1/report/activity/",
            {
                relative_range: 'this-week',
                type: 'overview',
                metrics: ["leads.contacted.all.count"]
            },
            getCloseAuth());
        const leadsContactedCount = response.data.aggregations.totals["leads.contacted.all.count"];
        res.send({ data: leadsContactedCount });
    } catch (error) {
        console.error("Failed to fetch calls from Close:", error.response?.status, error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch call data from Close" });
    }
});

export default router;