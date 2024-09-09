const express = require('express')
const app = express()

app.get('/', function (req, res) {
    res.send('Hello World')
})
app.get('/employee/:id/:id2', function (req, res) {
    const params=req.params;
    console.log("params.id",params.id);
    console.log("params.id2",params.id2);
    res.send(id,id2);
})
    
app.listen(9998 ,function(){
    const query=req.query;
    console.log("query",query);
    // console.log("params.id2",params.id2);
    res.send(query);
})