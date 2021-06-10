import { executeQuery } from '../../../lib/db';

async function handler(req, res) {
    try {    
        return res.json(await executeQuery('select * from agent'));
    }
    catch(e) {
        res.status(500).json({ message: e.message })
    }
}

export default handler;