import { executeQuery, executeTransaction } from '../../../lib/db';
import moment from 'moment';

async function handler(req, res) {
    const data = req.query;
    let { prop_id, buyer_phone, status } = data;

    const { prop_price: amt } = (await executeQuery(`select prop_price from property where prop_id = ${prop_id}`))[0];
    const { buyer_id } = (await executeQuery(`select buyer_id from buyer where buyer_phone = ${buyer_phone}`))[0];
    const { seller_id } = (await executeQuery(`select seller_id from seller_prop where prop_id = ${prop_id}`))[0];
    const { agent_id } = (await executeQuery(`select agent_id from agent_prop where prop_id = ${prop_id}`))[0];
    const date = moment().format('YYYY-MM-DD');
    //Generate record_id
    const records = await executeQuery(`select max(record_id) as max from record`);
    const record_id = records[0].max + 1;

    status = status === 'Sell' ? 'Sold' : 'Rented';

    try {
        const query = [
            `insert into record values(${record_id}, ${buyer_id}, ${seller_id}, ${agent_id}, ${prop_id}, "${date.toString()}", "${status}", ${amt})`,
            `update property set prop_status = "${status}" where prop_id = ${prop_id}`,
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