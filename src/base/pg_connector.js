async function pgConnector(){
    const pg = require("pg");
const { Client } = pg;
const client = new Client({
user: 'user_amish',
password: 'user_amish',
host: 'localhost',
port: 5432,
database: 'amish_db',
})
await client.connect();
return client;
}

module.exports={
    pgConnector:pgConnector
}