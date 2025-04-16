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

async function fetchMetric({ relative_range, type = 'overview', metrics }) {
    try {
        const response = await axios.post(BASE_URL, {
            relative_range,
            type,
            metrics
        }, getCloseAuth());

        return response.data;

    } catch (error) {
        console.error("Failed to fetch from Close:", error.response?.status, error.response?.data || error.message);
        throw new Error("Failed to fetch data from Close");
    }
}

export async function getWeeklyCalls() {
    const data = await fetchMetric({
        relative_range: 'this-week',
        metrics: ["calls.outbound.all.count"]
    });

    return data.aggregations.totals["calls.outbound.all.count"];
}

export async function getWeeklyContactedLeads() {
    const data = await fetchMetric({
        relative_range: 'this-week',
        metrics: ["leads.contacted.all.count"]
    });

    return data.aggregations.totals["leads.contacted.all.count"];
}

export async function getWeeklyTopCallers() {
    const data = await fetchMetric({
        relative_range: 'this-week',
        type: 'comparison',
        metrics: ["calls.outbound.all.count"]
    });

    const topThreeCallers = data.data
        .sort((a, b) => b["calls.outbound.all.count"] - a["calls.outbound.all.count"])
        .slice(0, 3)
        .map(caller => ({
            name: data.lookup.user[caller.user_id]?.display || "Unknown",
            calls: caller["calls.outbound.all.count"]
        }));

    return topThreeCallers;
}

export async function getWeeklyValueWon() {
    const data = await fetchMetric({
        relative_range: 'this-week',
        metrics: ["opportunities.won.all.sum_annualized_value"]
    });

    return data.aggregations.totals["opportunities.won.all.sum_annualized_value"];
}

export async function getYearlyValueWon() {
    const data = await fetchMetric({
        relative_range: 'this-year',
        metrics: ["opportunities.won.all.sum_annualized_value"]
    });

    return data.aggregations.totals["opportunities.won.all.sum_annualized_value"];
}