function main(req,res){
    console.log("request employee")
    res.send("Hello world!");
    
}
function main_with_slug(req,res){
    const params = req.params;
    console.log("params",params.id);
    console.log("params_subId",params.subId);
    res.send({id:params.id,subId:params.subId});
    
}
function main_with_query(req,res){
    const query = req.query;
    console.log("query",query);
    res.send(query);
    
}
function main_with_body(req,res){
        const body = req.body;
        console.log("body",body);
        res.send(body);
    
}
function main_with_header(req,res){
    const header = req.headers;
    console.log("body",header);
    res.send(header);
    
}
module.exports={
    main:main,
    main_with_slug:main_with_slug,
    main_with_query:main_with_query,
    main_with_body:main_with_body,
    main_with_header:main_with_header
}