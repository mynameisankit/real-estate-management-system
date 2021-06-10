import { executeQuery } from '../../../lib/db';

async function handler(req, res) {
    try {    
        const { userPassword, userType, userPhone } = req.query;

        const query = `select * from ${userType} where ${userType}_phone="${userPhone}" and ${userType}_password="${userPassword}"`;
        const userData = await executeQuery(query);

        if(userData.length) {
            return res.json(userData);
        }
        else {
            return res.status(403).json(false);
        }
    }
    catch(e) {
        console.log(e);
        res.status(500).json({ message: e.message })
    }
}

export default handler;