import { executeTransaction } from '../../../lib/db';

async function handler(req, res) {
    const { prop_id } = req.query;

    try {
        const query = [
            `delete from seller_prop where prop_id=${prop_id}`,
            `delete from agent_prop where prop_id=${prop_id}`,
            `delete from property where prop_id=${prop_id}`,
        ];

        executeTransaction(query);

        return res.json(true);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
        return false;
    }
}

export default handler;