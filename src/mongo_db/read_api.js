// db.employees.updateOne({ _id: 1 }, { $set: { salary: 9000 } })
const main =async(req,res)=>{
    const {mongodbConnector} = require("../base/mongo_db_connector")
    const data = req.body;
    const db =await mongodbConnector();
    const response = await db.collection('collection1').find(data).toArray();
    console.log(response);
    res.json({
        res:`Updated`,
        response
    });
}

module.exports={
    main
}