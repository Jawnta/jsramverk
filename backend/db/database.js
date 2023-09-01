// const sqlite3 = require('sqlite3').verbose();
// const { open } = require('sqlite');

// const database = {
//     openDb: async function openDb() {
//         let dbFilename = `./db/trains.sqlite`;

//         if (process.env.NODE_ENV === 'test') {
//             dbFilename = "./db/test.sqlite";
//         }

//         return await open({
//             filename: dbFilename,
//             driver: sqlite3.Database
//         });
//     }
// };

const { MongoClient } = require("mongodb");

const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);
let conn;
const database = {
    openDb: async function openDB() {
        try {
            conn = await client.connect();
            return conn.db("trains");
        } catch (e) {
            console.error(e);
        }

    }

}


console.log(database)
module.exports = database;
