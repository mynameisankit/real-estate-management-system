import { executeQuery } from '../../../lib/db';

async function handler(req, res) {
    const { seller_id } = req.query;

    try {
        const query = `select * from property natural join seller_prop natural join seller where seller_id = ${seller_id}`;
        const results = await executeQuery(query);

        return res.json(results);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export default handler;