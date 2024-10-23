const main =async(req,res)=>{
    const {mongodbConnector} = require("../base/mongo_db_connector")
    const data = req.body;
    const {delete_many} = req.query;
    const db =await mongodbConnector();
    if(delete_many=="true"){
        await db.collection('collection1').deleteMany(data);
        res.send("Deleted");
    } else{
        await db.collection('collection1').deleteOne(data);
        res.send("Deleted");
    }
}

module.exports={
    main
}