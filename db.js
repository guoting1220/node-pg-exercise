/** Database setup for BizTime. */

const {Client} = require('pg');

let DB_URL;

if (process.env.NODE_ENV === "test") {
    DB_URL = "postgresql:///biztime_test";
} else {
    DB_URL = "postgresql:///biztime";
}


const db = new Client({
    connectionString: DB_URL
});

db.connect();

module.exports = db;



