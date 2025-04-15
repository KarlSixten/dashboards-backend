import axios from 'axios';
import { getCloseAuth } from '../auth/closeAuth.js';

const BASE_URL = "https://api.close.com/api/v1/report/activity/";

export async function getMetrics() {
    try {
        const response = await axios.get(BASE_URL + "metrics/", getCloseAuth());
        const metrics = response.data;
        return metrics;
    } catch (error) {
        console.error("Failed to fetch calls from Close:", error.response?.status, error.response?.data || error.message);
        res.status(500).send({ error: "Failed to fetch data from Close" });
    }
}

export async function getWeeklyCalls() {
    try {
        const response = await axios.post(BASE_URL,
            {
                relative_range: 'this-week',
                type: 'overview',
                metrics: ["calls.outbound.all.count"]
            },
            getCloseAuth());
        const weeklyCalls = response.data.aggregations.totals["calls.outbound.all.count"];
        return weeklyCalls;
    } catch (error) {
        console.error("Failed to fetch from Close:", error.response?.status, error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch data from Close" });
    }
}

export async function getWeeklyContactedLeads() {
    try {
        const response = await axios.post(BASE_URL,
            {
                relative_range: 'this-week',
                type: 'overview',
                metrics: ["leads.contacted.all.count"]
            },
            getCloseAuth());
        const weeklyContactedLeads = response.data.aggregations.totals["leads.contacted.all.count"];
        return weeklyContactedLeads;
    } catch (error) {
        console.error("Failed to fetch from Close:", error.response?.status, error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch data from Close" });
    }
}

export async function getWeeklyTopCallers() {
    try {
        const response = await axios.post(BASE_URL,
            {
                relative_range: 'this-week',
                type: 'comparison',
                metrics: ["calls.outbound.all.count"]
            },
            getCloseAuth()
        );

        const weeklyTopCallers = response.data.data;
        const lookup = response.data.lookup;

        const topThreeCallers = weeklyTopCallers
            .sort((a, b) => b["calls.outbound.all.count"] - a["calls.outbound.all.count"])
            .slice(0, 3)
            .map(caller => ({
                name: lookup.user[caller.user_id]?.display || "Unknown",
                calls: caller["calls.outbound.all.count"]
            }));

        return topThreeCallers;
    } catch (error) {
        console.error("Failed to fetch from Close:", error.response?.status, error.response?.data || error.message);
        throw new Error("Failed to fetch data from Close");
    }
}