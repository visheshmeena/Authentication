require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();
console.log(process.env.API_KEY);

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

main().catch(err => console.log(err));
 
async function main() {
  await mongoose.connect('mongodb://localhost:27017/userDB');
}

const userSchema= new mongoose.Schema({ 
    email:String,
    password:String
});
userSchema.plugin(encrypt,{secret:process.env.SECERET, encryptedFields:['password'] });

const User=new mongoose.model("User",userSchema);


app.get("/", async(req,res)=>{
    res.render("home");
});

app.route("/login")
.get (async(req,res)=>{
    res.render("login");
})

.post(async(req,res)=>{
    const username = req.body.username;
    const password= req.body.password;

    User.findOne({email:username})
    .then(foundUser=>{
        if(foundUser.password===password){
            res.render("secrets");
        }
    })
    .catch(err => {
        console.log(err);
    })
});


app.route("/register")
.get (async(req,res)=>{
    res.render("register");
})

.post(async(req,res)=>{
    const newUser= new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save()
    .then(success => {
        res.render("secrets");
        console.log("Succesfully added a new article");
    }).catch(err => {
        console.log(err);
    })
});


app.listen(3000, () => {
console.log("Server started on port 3000");
});