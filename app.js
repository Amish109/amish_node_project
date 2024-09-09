const express = require('express')
const app = express()

var bodyParser = require('body-parser') // middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.get('/employee/:id/:id2', function (req, res) {
    const params=req.params;
    console.log("params.id",params.id);
    console.log("params.id2",params.id2);
    res.send(id,id2);
})
app.get('/employee', function (req, res) {
    const params=req.query;
    console.log("params",params);
    res.send(params);
})
app.post('/employee', function (req, res) {
    const body=req.body;
    console.log("body",body);
    res.send(body);
})
    













app.listen(9998 ,function(req, res){
  console.log("Server running")
})




/*
    to get the data from user through slug : req.params 
    to get the data from user through query params : req.query 
    to get the data from user through query payload : req.body 
    to get the data from user through query headers : req.headers 
*/