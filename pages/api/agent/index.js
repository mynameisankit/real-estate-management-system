import { executeQuery } from '../../../lib/db';

async function handler(req, res) {
    let filters = req.query;

    try {
        const query = createQuery(filters);
        const results = await executeQuery(query);

        return res.json(results);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
}

function createQuery(filters) {
    let query = "select * from property natural join agent_prop natural join agent natural join seller_prop natural join seller where ";

    let { house_no, city, state, street, type, rent, sale, rented, sold, prop_price, prop_area, bhk, agent_id } = filters;
    rent = JSON.parse(rent);
    sale = JSON.parse(sale);
    sold = JSON.parse(sold);
    rented = JSON.parse(rented);

    let conditions = [];

    if (house_no !== '') conditions.push(`house_no = "${house_no}"`);
    if (street !== '') conditions.push(`street = "${street}"`);
    if (city !== '') conditions.push(`city = "${city}"`);
    if (state !== '') conditions.push(`state_name = "${state}"`);
    if (type !== '') conditions.push(`prop_type = "${type}"`);
    if (rent || sale || rented || sold) {
        const array = [];
        if(rent) array.push('"Rent"');
        if(sale) array.push('"Sale"');
        if(rented) array.push('"Rented"');
        if(sold) array.push('"Sold"');

        let str = "prop_status in (";
        for(let i in array) {
            if(i === 0) {
                str += array[i];
                str += i == array.length - 1 ? "" : ", ";
            }
            else if(i == array.length - 1) {
                str += array[i];
            }
            else {
                str += `${array[i]}, `;
            }
        }
        str += ")";
        conditions.push(str);
    }
    if (bhk !== '') conditions.push(`bhk = ${bhk}`);
    if (prop_price !== '') conditions.push(`prop_price = ${price}`);
    if (prop_area !== '') conditions.push(`prop_area = ${area}`);

    for (let i in conditions)
        query += `${conditions[i]} and `;

    query += `agent_id = ${agent_id}`;

    return query;
}

export default handler;