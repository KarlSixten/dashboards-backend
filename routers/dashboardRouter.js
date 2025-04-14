import { Router } from 'express';
import axios from 'axios';
import { getCloseAuth } from '../auth/closeAuth.js';

const router = Router();

router.get("/", (req, res) => {
    res.send({ message: "test" });
});

router.get("/api/close-data", async (req, res) => {
    try {
        const response = await axios.get("https://api.close.com/api/v1/activity/", getCloseAuth());
        res.send(response.data);
    } catch (error) {
        console.error("Failed to fetch from Close:", error.message);
        res.status(500).send({ error: "Failed to fetch data from Close" });
    }
});

export default router;