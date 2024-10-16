// students table name
async function main(req,res){
    console.log("Create")
    const {id,rollno,name,city} = req.body;
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
    await client.query('INSERT INTO students(id,"roll no",name,city) VALUES($1,$2,$3,$4)', [id,rollno,name,city],async function(err,data){
        if(err){
            console.log("Error",err);
            res.send(`ERROR in inserting the vlaue:-  ${err}`);
        } else{
            console.log(data.rows,'Created');
            // res.send(data.rows);
            res.send("Value Inserted Sucessfully!!");
        }
        await client.end();
    });
    // console.log(result);
    
}

module.exports={
    main
}