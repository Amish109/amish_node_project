const main =async(req,res)=>{
    const {mongodbConnector} = require("../base/mongo_db_connector")
    const data = req.body;
    const db =await mongodbConnector();
    if(Array.isArray(data)){
        await db.collection('collection1').insertMany(data);
        res.send("Created");
        // db.collection('collection1').insertMany(data,function(error,data){
        //     if(error){
        //         console.log(`Error ${error}`);
        //         res.send(`Error ${error}`);
        //     } else{
        //         console.log("Created");
        //         res.send("Created");
        //     }
        // });
    } else{
        await db.collection('collection1').insertOne(data);
        res.send("Created");
        // db.collection('collection1').insertOne(data,function(error,data){
        //     if(error){
        //         console.log(`Error ${error}`);
        //         res.send(`Error ${error}`);
        //     } else{
        //         console.log("Created");
        //         res.send("Created");
        //     }
        // });
    }
}

module.exports={
    main
}