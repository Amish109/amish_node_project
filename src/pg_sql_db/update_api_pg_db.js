async function main(req,res){
    const pg = require("pg");
    let {column_to_update,value}=req.query;
    let {id} = req.params;
    const { Client } = pg;
    const client = new Client({
    user: 'user_amish',
    password: 'user_amish',
    host: 'localhost',
    port: 5432,
    database: 'amish_db',
    })
    await client.connect();
    await client.query(`UPDATE students set ${column_to_update}=$1 WHERE id=$2`, [value,id],async function(err,data){
        if(err){
            console.log("Error",err);
            res.send(err);
        } else{
            console.log(`Column Updated :-${data.rows}`);
            res.send(`Column Updated :-${data.rows}`);
        }
        await client.end();
    });
    // console.log(result);
}

module.exports={
    main
}



// async function async1() {
//     console.log("async1 start");
//     await async2();
//     console.log("async1 end");
//   }
//   async function async2() {
//     console.log("async2");
//   }
//   console.log("script start");
//   setTimeout(function () {
//     console.log("setTimeout");
//   }, 0);
//   async1();
//   new Promise(function (resolve) {
//     console.log("promise1");
//     resolve();
//   }).then(function () {
//     console.log("promise2");
//   });
//   console.log("script end");