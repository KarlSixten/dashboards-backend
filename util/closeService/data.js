import axios from 'axios';
import { getCloseAuth } from '../../auth/closeAuth.js';

const BASE_URL = "https://api.close.com/api/v1/report/activity/";

async function fetchMetric({ relative_range, type = 'overview', metrics, users }) {
    try {
        const response = await axios.post(BASE_URL, {
            relative_range,
            type,
            metrics,
            users
        }, getCloseAuth());
        return response.data;
    } catch (error) {
        console.error("Failed to fetch from Close:", error.response?.status, error.response?.data || error.message);
        throw new Error("Failed to fetch data from Close");
    }
}

async function getWeeklyCalls(group) {
    const data = await fetchMetric({
        relative_range: 'this-week',
        metrics: ["calls.outbound.all.count"],
        users: group
    });
    return data.aggregations.totals["calls.outbound.all.count"];
}

async function getWeeklyContactedLeads(group) {
    const data = await fetchMetric({
        relative_range: 'this-week',
        metrics: ["leads.contacted.all.count"],
        users: group
    });
    return data.aggregations.totals["leads.contacted.all.count"];
}

async function getWeeklyTopCallers(group) {
    const data = await fetchMetric({
        relative_range: 'this-week',
        type: 'comparison',
        metrics: ["calls.outbound.all.count"],
        users: group
    });
    const topThreeCallers = processTopCallersOrEmailers(data, 'calls.outbound.all.count', 'user');
    return topThreeCallers;
}

async function getWeeklyTopEmailers(group) {
    const data = await fetchMetric({
        relative_range: 'this-week',
        type: 'comparison',
        metrics: ["emails.sent.all.count"],
        users: group
    });
    const topThreeEmailers = processTopCallersOrEmailers(data, 'emails.sent.all.count', 'user');
    return topThreeEmailers;
}

async function getWeeklyValueWon(group) {
    const data = await fetchMetric({
        relative_range: 'this-week',
        metrics: ["opportunities.won.all.sum_annualized_value"],
        users: group
    });

    const perDayFormatted = data.data
        .map(item => {
            const date = new Date(item.datetime);
            const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
            const dayIndex = date.getDay();
            return {
                day: dayOfWeek,
                value: item["opportunities.won.all.sum_annualized_value"],
                dayIndex: dayIndex
            };
        })
        .filter(item => item.dayIndex !== 0 && item.dayIndex !== 6)
        .map(item => ({ day: item.day, value: item.value }));

    return {
        total: data.aggregations.totals["opportunities.won.all.sum_annualized_value"],
        perDay: perDayFormatted
    };
}

async function getYearlyValueWon(group) {
    const data = await fetchMetric({
        relative_range: 'this-year',
        metrics: ["opportunities.won.all.sum_annualized_value"],
        users: group
    });
    return data.aggregations.totals["opportunities.won.all.sum_annualized_value"];
}

async function getWeeklyEmailsSent(group) {
    const data = await fetchMetric({
        relative_range: 'this-week',
        metrics: ["emails.sent.all.count"],
        users: group
    });
    return data.aggregations.totals["emails.sent.all.count"];
}

async function getAverageCallTimeToday(group) {
    const data = await fetchMetric({
        relative_range: 'today',
        metrics: ["calls.all.all.avg_duration"],
        users: group
    });
    return data.aggregations.totals["calls.all.all.avg_duration"];
}

async function getTotalCallTimeToday(group) {
    const data = await fetchMetric({
        relative_range: 'today',
        metrics: ["calls.all.all.sum_duration"],
        users: group
    });
    return data.aggregations.totals["calls.all.all.sum_duration"];
}

function processTopCallersOrEmailers(data, metricKey, lookupKey) {
    return data.data
        .sort((a, b) => b[metricKey] - a[metricKey])
        .slice(0, 3)
        .map(item => ({
            name: data.lookup[lookupKey][item[`${lookupKey}_id`]]?.display || "Unknown",
            [metricKey.split('.').pop()]: item[metricKey]
        }));
}

export async function fetchDashboardData(userIds) {
    const [
        weeklyCalls,
        weeklyContactedLeads,
        weeklyTopCallers,
        weeklyValueWon,
        yearlyValueWon,
        weeklyEmailsSent,
        weeklyTopEmailers,
        averageCallTimeToday,
        totalCallTimeToday
    ] = await Promise.all([
        getWeeklyCalls(userIds),
        getWeeklyContactedLeads(userIds),
        getWeeklyTopCallers(userIds),
        getWeeklyValueWon(userIds),
        getYearlyValueWon(userIds),
        getWeeklyEmailsSent(userIds),
        getWeeklyTopEmailers(userIds),
        getAverageCallTimeToday(userIds),
        getTotalCallTimeToday(userIds)
    ]);

    return {
        weeklyCalls,
        weeklyContactedLeads,
        weeklyTopCallers,
        weeklyValueWon,
        yearlyValueWon,
        weeklyEmailsSent,
        weeklyTopEmailers,
        averageCallTimeToday,
        totalCallTimeToday
    };
}