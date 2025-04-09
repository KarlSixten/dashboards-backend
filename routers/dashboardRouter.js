import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.get("/", (req, res) => {
    res.send({ data: "Test "});
});

export default router;