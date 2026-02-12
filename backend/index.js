const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")

const app = express()

app.use(cors())
app.use(express.json());

mongoose.connect("mongodb+srv://renganathan1:renganathan123@cluster0.iwk2h0w.mongodb.net/bulkmail").then(function(){
    console.log("connect to database");

}).catch(function(){
    console.log("failed to connect");
    
})

const credentialSchema = new mongoose.Schema({
  user: String,
  pass: String
});

const Credential = mongoose.model("Credential", credentialSchema);


app.post("/sendemail",function(req,res)
{
    const msg = req.body.msg
    const emails = req.body.emails
    console.log(msg);
    console.log(emails);

    Credential.findOne().then(function(data)
{
    console.log(data);
// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
    service:"gmail",
  auth: {
    user: data.user,
    pass: data.pass,
  },
});

new Promise(async function(resolve,reject){
        try{
            for(let i=0; i< emails.length ; i++){
                await transporter.sendMail(
                    {
                        from:data.user,
                        to:emails[i],
                        subject:"bulk mail",
                        text:msg,
                    },
                )
                console.log("send to "+emails[i]);
            }
            resolve("Success")
        }
        catch(error){
            console.log("email error:");
            console.log(error);
            reject(error)
        }
    }).then(function()
    {
        res.send(true)
        console.log("Success");
    }).catch(function()
    {
        res.send(false)
        console.log("Failed");
    })

}).catch(function(error){
    console.log(error);
})
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});