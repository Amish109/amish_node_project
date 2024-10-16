//  API for Pagination
const main = async(req,res)=>{
    const {page_number,page_length} = req.query;
    const {pgConnector} = require("../../base/pg_connector");
    let total=null;
    const client = await pgConnector();
    let with_database = true;
    if(with_database == false){
    // With Node
        await client.query("SELECT * FROM employee",[],(err,data)=>{
        // await client.query("SELECT * FROM employee WHERE location='mumbai'",[location],(err,data)=>{
            if(err){
                console.log("ERROR in searching employee:-",err);
                res.send(err);
            } else{
                let output_data = data.rows;
                // let start= ((page_length*page_number)-page_length)+1 ;
                let start= ((page_length*page_number)-page_length) ;
                console.log("START",start)
                let end= page_length*page_number;
                console.log("END",end)
                let data_to_send = output_data.slice(start,end)
                console.log(data_to_send);
                res.send({
                    data_to_send,
                    total_data:output_data.length
                });
            }
        })
    } else {
    //Pagination with DB
        await client.query("SELECT * FROM employee LIMIT $1 OFFSET $2",[page_length,((page_number-1)*page_length)],(err,data)=>{
            // await client.query("SELECT * FROM employee WHERE location='mumbai'",[location],(err,data)=>{
                if(err){
                    console.log("ERROR in searching employee:-",err);
                    res.send(err);
                } else{
                    let data_to_send = data.rows;
                    console.log(data_to_send);
                    res.send({
                        data_to_send,
                        // total_data:output_data.length
                    });
                }
        })
    }
}
//LIMIT to take records ,Offset to ignore number of datas
module.exports={
    main
}

/*
slice :- are used to get a new array from a original array and we can get a array from a given index to a given index
splice :- changes the original array ,takes 3 params (index from where to delete items,numbers of items to delete,itmes to add at that index)

*/