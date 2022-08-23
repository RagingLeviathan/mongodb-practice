const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

//this require gets a repo object
const circulationRepo = require('./repos/circulationRepo');
const data = require('./circulation.json')

const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

async function main() {
    const client = new MongoClient(url);

    //hold processing until client.connect comes back
    //expecting a promise so telling it to await and stop processing until it gets done
    await client.connect();

    try {
        const results = await circulationRepo.loadData(data);

        //using assert to test, we make sure that the amount of inserted items equals the amount of items sent in.
        assert.equal(data.length, results.insertedCount);

        //log out how many results were inserted
        //console.log(results.insertedCount, results.ops);


        //getdata
        const getData = await circulationRepo.getData();
        assert.equal(data.length, getData.length);
    } catch (error) {
        //spit out errors
        //done this way, it allows us to show errors, but cleanup is still allowed to run in the finally
        console.log(error);

        //asserts throw errors, but when we throw an error, we could lose all our cleanup, so keep it in a catch block and add cleanup to finally block instead

        //done this way, we are able to service the error, whilst still doing cleanup
    } finally {
        //cleanup



        //admin is an object that lets us do some introspection on server
        const admin = client.db(dbName).admin();

        //drops circulation collection/db
        await client.db(dbName).dropDatabase();

        //console.log(await admin.serverStatus());
        console.log(await admin.listDatabases());

        client.close();
    }
}

main();