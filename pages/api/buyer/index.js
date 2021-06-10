import { executeQuery } from '../../../lib/db';

async function handler(req, res) {
    let filters = req.query;

    try {
        const query = createQuery(filters);
        const results = await executeQuery(query); 
    
        return res.json(results);
    }
    catch(e) {
        res.status(500).json({ message: e.message })
    }
}

function createQuery(filters) {
    let query = 'select * from property natural join agent_prop natural join agent where prop_status not in ("Rented", "Sold") and ';

    let { street, city, state, type, rent, sale, budget_max, budget_min, area_max, area_min, bhk } = filters;
    rent = JSON.parse(rent);
    sale = JSON.parse(sale);

    if (area_max === '') area_max = parseInt(Math.pow(2, 32) - 1);
    if (area_min === '') area_min = 0;

    if (budget_max === '') budget_max = parseInt(Math.pow(2, 32) - 1);
    if (budget_min === '') budget_min = 0;

    let conditions = [];

    if (street !== '') conditions.push(`street = "${street}"`);
    if (city !== '') conditions.push(`city = "${city}"`);
    if (state !== '') conditions.push(`state_name = "${state}"`);
    if (type !== '') conditions.push(`prop_type = "${type}"`);
    if (!(rent && sale)) conditions.push(`prop_status = "${rent ? "Rent" : "Sale"}"`);
    if (bhk !== '') conditions.push(`bhk = ${bhk}`);

    conditions.push(`prop_price between ${budget_min} and ${budget_max}`);
    conditions.push(`prop_area between ${area_min} and ${area_max}`);

    for (let i in conditions)
    query += conditions[i] + (parseInt(i) != conditions.length - 1 ? ` and ` : ``);

    return query;
}

export default handler;