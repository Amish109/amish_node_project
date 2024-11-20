// const fs = require('fs');
const main=async(req,res)=>{
const nodemailer = require("nodemailer");
const {pgConnector} = require('../base/pg_connector');
    console.log("pgConnector",pgConnector)
    const client = await pgConnector();
let {to}=req.body;
let {subject}=req.body;
let {text}=req.body;
let {html}=req.body;
let {attachments}=req.body;
console.log(`to
subject
text
html
attachments`,to,subject,text,html,attachments);
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "tiwariamish786@gmail.com",
    pass: "ccjuzdnwfpbrcnxm",
  },
  tls : { rejectUnauthorized: false }
});

// async..await is not allowed in global scope, must use a wrapper
async function main2() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <tiwariamish786@gmail.com>', // sender address 
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
    attachments: attachments
  });

  console.log("Message sent: %s", info.messageId);
  console.log("info ",info);

  await client.query('INSERT INTO email_stats(email_from,email_to,subject,body,email_status,attachment,email_response_id) VALUES($1,$2,$3,$4,$5,$6,$7)', ["tiwariamish786@gmail.com",to,subject,{text,html},"success",attachments[0].filename,info.messageId],async function(err,data){
    if(err){
        console.log("Error",err);
        res.send(`ERROR in inserting the vlaue:-  ${err}`);
    } else{
        console.log(data.rows,'Created');
        // res.send(data.rows);
        res.send("Value Inserted Sucessfully!!");
    }
    await client.end();
});
  
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main2().catch(async(error)=>{
    console.error(error);
    await client.query('INSERT INTO email_stats(email_from,email_to,subject,body,email_status,attachment,email_response_id) VALUES($1,$2,$3,$4,$5,$6,$7)', ["tiwariamish786@gmail.com",to,subject,{text,html},"fail",attachments[0].filename,info.messageId],async function(err,data){
        if(err){
            console.log("Error",err);
            res.send(`ERROR in inserting the vlaue:-  ${err}`);
        } else{
            console.log(data.rows,'Created');
            // res.send(data.rows);
            res.send("Value Inserted Sucessfully!!");
        }
        await client.end();
    });
    res.send("Error");
    return;
});

    // console.log("create");  
    // res.send("create");
    }
module.exports={
    main:main
}

/*
Store the file path if its using any 
-- If the file is being made with content and file name save it fs create api
-- Use multer if we are uploading file
-- */ 