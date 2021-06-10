import { executeTransaction, executeQuery } from '../../../lib/db';

//3. Count properties assigned to each agent
//4. Assign to agent with minimum properties

async function handler(req, res) {
    let data = req.query;

    //Find agent with minimum properties
    const agentList = await executeQuery(`select agent_id, count(agent_id) as count from agent_prop group by agent_id`)
    let min = Number.MAX_VALUE;
    let agent_id = 0;
    agentList.forEach(agent => {
        if(agent.count < min) {
            min = agent.count;
            agent_id = agent.agent_id; 
        } 
    });

    //Generate prop_id
    const properties = await executeQuery(`select max(prop_id) as max from property`);
    const prop_id = properties[0].max + 1;

    try {
        const query = [
            `insert into property values(${prop_id}, ${data.house_no}, "${data.house_name}", "${data.street}", "${data.city}", "${data.state}", ${data.pincode}, "${data.type}", ${data.prop_price}, "${data.prop_area}", ${data.bhk}, "${data.prop_status}")`,
            `insert into seller_prop values(${data.seller_id}, ${prop_id})`,
            `insert into agent_prop values(${prop_id}, ${agent_id})`
        ];

        executeTransaction(query);
        return res.json(true);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
}

export default handler;