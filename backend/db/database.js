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

module.exports = database;
