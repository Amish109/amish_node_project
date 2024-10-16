//  API for Search functionality
const main = async(req,res)=>{
    const {location} = req.query;
    const {pgConnector} = require("../../base/pg_connector");
    const client = await pgConnector();
    await client.query("SELECT * FROM employee WHERE location ILIKE $1",[`%${location}%`],(err,data)=>{
    // await client.query("SELECT * FROM employee WHERE location='mumbai'",[location],(err,data)=>{
        if(err){
            console.log("ERROR in searching employee:-",err);
            res.send(err);
        } else{
            console.log(data.rows);
            res.send(data.rows);
        }
    })
}

module.exports={
    main
}
    
    // await client.query("SELECT * FROM employee WHERE location = $1",[location],(err,data)=>{}) // will match the exact name
    
    // await client.query("SELECT * FROM employee WHERE location LIKE $1",['%mumb%'],(err,data)=>{}) // will match- ?mum? , where ? means anything
    
    // await client.query("SELECT * FROM employee WHERE location ILIKE $1",['%mum%'],(err,data)=>{}) // will match- case insitive ?mum? , where ? means anything
    
    // await client.query("SELECT * FROM employee WHERE location ILIKE $1",['mumbai%'],(err,data)=>{}) // will match- case insitive mumbai? , starting with given name and can end with anything
    
    // await client.query("SELECT * FROM employee WHERE location ILIKE $1",['m___i%'],(err,data)=>{}) // will match- case insitive  , starting with m and having i after 3 characters can end with anything