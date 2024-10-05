async function main(req,res){
    const pg = require("pg");
    let {id} = req.params;
    console.log("id",id)
    const { Client } = pg;
    const client = new Client({
    user: 'user_amish',
    password: 'user_amish',
    host: 'localhost',
    port: 5432,
    database: 'amish_db',
    })
    await client.connect();
    await client.query(`DELETE FROM students WHERE id=$1`, [id],async function(err,data){
        if(err){
            console.log("Error",err);
            res.send(err);
        } else{
            console.log(`Columns Deleted : - ${data.rows}`);
            res.send(`Columns Deleted : - ${data.rows}`);
        }
        await client.end();
    });
    // console.log(result);
}

module.exports={
    main
}


