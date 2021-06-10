import mysql from 'serverless-mysql'

export const db = mysql({
    //Store in .env
    config: {
        host: '54.254.218.69',
        user: 'realestate',
        password: 'littleshark',
        database: 'realestate',
    },
});

export async function executeQuery(q) {
    try {
        const results = await db.query(q);
        await db.end();
        return results;
    } catch (e) {
        throw Error(e.message);
    }
}

export async function executeTransaction(q, callback) {
    //Q is our array of queries
    try {
        //Start transactions
        let results = db.transaction();
        //Chain Queries
        q.forEach(query => { results = results.query(query); });
        //Rollback
        results = results.rollback(e => { console.log(e) })
        //Execute the queries
        results = await results.commit();

        //Clean-up
        await db.end();
        return results;
    } catch (e) {
        return Error(e.message);
    }
}
