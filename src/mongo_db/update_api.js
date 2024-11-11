// db.employees.updateOne({ _id: 1 }, { $set: { salary: 9000 } })
const main =async(req,res)=>{
    const {mongodbConnector} = require("../base/mongo_db_connector")
    const data = req.body;
    const {key,value,update_many} = req.query;
    const db =await mongodbConnector();
    const query ={};
    query[`${key}`] = value;
    if(update_many=="true"){
        const response=await db.collection('collection1').updateMany(query, { $set: data });
        res.json({
            res:`Updated`,
            response
        });
    } else{
        const response = await db.collection('collection1').updateOne(query, { $set: data},{new:true,upsert:true});
        res.json({
            res:`Updated`,
            response
        });
    }
}

module.exports={
    main
}


// const query = { name: "Deli Llama" }; // The filter to find the document
// const update = { $set: { address: "3 Nassau St" }}; // The update operation
// const options = { upsert: true }; // Enable upsert

// // Perform the upsert operation
// db.foodTrucks.updateOne(query, update, options);