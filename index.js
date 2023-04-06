require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI);


const productSchema = new mongoose.Schema(
	{
		_id: {
			type: Number,
		},
		name: {
			type: String,
		},
		price: {
			type: Number,
		},	
		color: {
			type: String,
		},
		desc: {
			type: String,
		},
		category: {
			type: String,
		},
		images:[{
            type: String
        }],
        id:{
            type:String
        }
	}
);
const Product = mongoose.model("Product", productSchema);


const cartSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
		},
		name: {
			type: String,
		},
        category:{
            type:String,
        },
		price: {
			type: Number,
		},	
		images:[{
            type: String
        }],
	}
);
const Cart = mongoose.model("Cart", cartSchema);


const userSchema = new mongoose.Schema({
    _id:{
        type:Number
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    address:{
        type:String
    },
    city:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:Number
    },
    password:{
        type:String
    },
    gender:{
        type:String
    }
});


const User = mongoose.model("User", userSchema);

const visitorSchema = new mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
    },
    email:{
        type:String
    }
})

const Visitor = mongoose.model("Visitor", visitorSchema);

app.get("/", function(req, res){
    
    Product.find({})
    .then(function(foundProducts){  
        res.render("home", {Product:foundProducts});
    })
    .catch(err=>{
        console.log(err);
    })
})


app.get("/newsletter", function(req, res){
    res.redirect("/");
})

app.post("/newsletter", function(req, res){
    const visitor1 = new Visitor({email:req.body.visitorEmail});
    visitor1.save();
    res.redirect("/");
})

app.get("/shop", function(req, res){
     Product.find({})
     .then(function(foundProducts){  
        res.render("shop", {Product:foundProducts});
    })
    .catch(err=>{
        console.log(err);
    })
})

app.get("/shop/:id/addToCart", function(req, res){
    Product.find({"id":req.params.id})
    .then(function(foundProduct){
        Cart.findById(req.params.id)
        .then(function(cartItem){
             if(cartItem == [] || cartItem == '[]' || cartItem==null){
                const newItem = new Cart({_id:req.params.id, name:foundProduct[0].name,category:foundProduct[0].category, price:foundProduct[0].price, images:foundProduct[0].images})
                newItem.save();
            }
            
            res.redirect("/"+foundProduct[0].category+"/"+foundProduct[0].id);
             
        })
        .catch((error)=>{
            console.log(error);
        })
    })
    .catch((err)=>{
        console.log(err);
    })
})
app.get("/:id/deleteFromCart", function(req, res){
    Cart.findOneAndDelete({_id:req.params.id})
    .then(function(doc){
        res.redirect("/cart");
    })
    .catch(function(err){
        console.log(err);
    })
})
app.get("/cart", function(req, res){
    Cart.find({})
    .then(function(foundItems){
        res.render("cart", {items:foundItems});
    })
})

app.route("/profile/:userId")
.get( function(req, res){ 
    User.find({"_id":req.params.userId})
        .then(function(foundUser){ 
        res.render("profile", {user:foundUser});
    })
    .catch(error => {
         console.log(error);
   });
})
.post(function(req, res){
    
    User.findOneAndUpdate(
        {"_id":req.params.userId},
        {
            firstName:req.body.firstname,
            lastName:req.body.lastname,
            phone:req.body.phone,
            address:req.body.address,
            city:req.body.city,
            email:req.body.email,
            gender:req.body.gender
        } 
    )
    .then(()=>{
        res.redirect("/profile/"+req.params.userId);
    })
    .catch(error=>{
        console.log(error);
    });
  
})

    
   


app.get("/:cat", function(req, res){
Product.find({"category":req.params.cat})
.then(async function(foundProducts){ 
    var found = await foundProducts; 
    // var temp = foundProducts[0].category;
    var temp = req.params.cat;
    Category = temp[0].toUpperCase()+temp.slice(1).toLowerCase();
    res.render("category", {products:found, cat:req.params.cat,id:241, category:Category});
})
.catch(err=>{
    console.log(err);
})
})
app.get("/:cat/:id", function(req, res){
 
Product.find({"id":req.params.id})
.then(function(foundProduct){ 
    Product.find({"category":req.params.cat})
    .then(function(foundProducts){
        res.render("shop", {Product:foundProduct,cat:req.params.cat, Products:foundProducts});
    })
})
.catch(err=>{
    console.log(err);
})
})
  


app.listen(3000, function(req, res){
    console.log("server is running on port 3000");
});