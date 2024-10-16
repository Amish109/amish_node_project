async function main(req,res){
    // const pg = require("pg");
    // const { Client } = pg;
    // const client = new Client({
    // user: 'user_amish',
    // password: 'user_amish',
    // host: 'localhost',
    // port: 5432,
    // database: 'amish_db',
    // })
    // await client.connect();
    const {pgConnector} = require('../base/pg_connector');
    console.log("pgConnector",pgConnector)
    const client = await pgConnector();
    await client.query('SELECT * FROM students', [],async function(err,data){
        if(err){
            console.log("Error",err);
            res.send(err);
        } else{
            console.log(data.rows);
            res.send(data.rows);
        }
        await client.end();
    });
    // console.log(result);
    
}

module.exports={
    main
}