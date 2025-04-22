import { Router } from 'express';
import { fetchDashboardData } from '../util/closeService/data.js';
import { groups } from '../util/closeService/groups.js';

const router = Router();

router.get("/api/dashboard-data/:groupName", async (req, res) => {
  const { groupName } = req.params;
  const group = groups.find((group) => group.name.toLowerCase() === groupName);

  if (!group) {
    return res.status(404).send({ error: `Group "${groupName}" not found` });
  }

  const groupMemberIds = group.members.map((member) => member.user_id);

  try {
    const dashboardData = await fetchDashboardData(groupMemberIds);
    res.send({ data: dashboardData });
  } catch (error) {
    console.error(`Error fetching dashboard data for group "${groupName}":`, error);
    res.status(500).send({ error: `Failed to fetch dashboard data for group "${groupName}"` });
  }
});

router.get("/api/groups", async (req, res) => {
  res.send(groups);
})

export default router;