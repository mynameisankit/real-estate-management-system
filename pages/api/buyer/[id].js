//TODO: Fetch Transactions
function handler(req, res) {
    const { id } = req.query; 
    return res.json(id);
}

export default handler;