//destructuring
const {MongoClient, ObjectID} = require('mongodb');

//our circulation object

//revealing module pattern in js
//a function to build out our repo
//put all our stuff in here
//and then just return the object
function circulationRepo(){
    const url = 'mongodb://localhost:27017';
    const dbName = 'circulation';

    function getData(){
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);

                //we had dropped it into newspapers so pull it out of newspapers
                //.find will return a cursor
                //in order to get items back, need to call items.toArray
                //this does nothing, it doesn't hit the database...until you call toArray
                const items = db.collection('newspapers').find();

                //needed await here because here is where the work will be done
                resolve(await items.toArray());

                //dont forget to close client
                client.close();
            } catch (error) {
                reject(error);
            }
        });
    }

    function loadData(data){
        //a promise works by taking a callback/method, with resolve and reject, 
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                //open up connection 
                await client.connect();
                const db = client.db(dbName);

                //takes a json object
                //and returns the results of the insertion of that data
                results = await db.collection('newspapers').insertMany(data);
                resolve(results);
                client.close();
            } catch (error) {
                reject(error);
            }
        });
    }

    
    //return these function inside this object
    //it adds them to the output
    return {loadData, getData};

}

//since when we execute it it's going to return a repo object, execute it straigt away
module.exports = circulationRepo();