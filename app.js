const express = require("express")
var bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use(express.json());

require("./router")(app);


// // Getting Hwllo world on http://localhost:9998
// app.get("/",function(req,res) {
//     res.send("Hello world!");
// })

// // Getting data through slug for eg( /employee/1)  
// // getting slug data by using req.params
// app.get("/employee/:id/:subId",function(req,res) {
    // const params = req.params;
    // console.log("params",params.id);
    // console.log("params_subId",params.subId);
    // res.send({id:params.id,subId:params.subId});
// })
// app.get("/employee_query",function(req,res) {
//     const query = req.query;
//     console.log("query",query);
//     res.send(query);
// })
// app.post("/employee_body_data",function(req,res) {
//     const body = req.body;
//     console.log("body",body);
//     res.send(body);
// })
// app.get("/employee_header_data",function(req,res) {
//     const header = req.headers;
//     console.log("body",header);
//     res.send(header);
// })



app.listen(9998,function(error) {
    console.log("Server running on 9998");
})