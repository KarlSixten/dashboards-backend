import axios from 'axios';
import { getCloseAuth } from '../../auth/closeAuth.js';

const BASE_URL = "https://api.close.com/api/v1/";

export const groups = [];

try {
    const res = await axios.get(`${BASE_URL}group/`, getCloseAuth());
    const basicGroups = res.data.data;

    const detailedGroups = await Promise.all(
        basicGroups.map(async (group) => {
            const fullGroupRes = await axios.get(
                `${BASE_URL}group/${group.id}/?_fields=id,name,members,organization_id`,
                getCloseAuth()
            );
            return fullGroupRes.data;
        })
    );

    groups.push(...detailedGroups);
} catch (error) {
    console.error("Error loading groups:", error.response?.status, error.response?.data || error.message);
}