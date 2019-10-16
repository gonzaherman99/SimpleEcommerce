require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const nodemailer = require("nodemailer");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const async = require("async");
const crypto = require("crypto");
const helmet = require("helmet");

//const encrypt = require('mongoose-encryption');



var app = express();
 

app.use(helmet());

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(cookieParser("[mysecrethere]"));


app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { expires : new Date(Date.now() + 360000) }
}));


app.use(flash());
var session1;


app.use(function(req, res, next) {
    //Checking previously set cookie (if there is one) 
    var session = req.session.cookie || '';
    
    
    
    if (new Date(session._expires) < new Date()) {
        console.log('User session has expired.');
        Order.deleteMany({session:  session1}, function(err, c) {
      });
       req.session.cookie.expires = new Date(Date.now() + 360000)
    } else {
        console.log("Not");
    }
    next();
}); 


app.use(passport.initialize());
app.use(passport.session());

                         
// mongoose
mongoose.connect("mongodb+srv://++++++++++@cluster0-okw4h.mongodb.net/productosDB",
   {useNewUrlParser: true});

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true); 

const usersSchema = {
    user: String,
    registerToken: String,
    registerExpires: Date
};

const credentialsSchema = new mongoose.Schema ({
    username: String,
    password: String,
    phone: Number,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

const productsSchema = {
    id: Number,
    name: String,
    price: Number
};

const orderSchema = {
    session: String,
    amount: Number,
    name: String,
    price: Number,
    total: Number
};

credentialsSchema.plugin(passportLocalMongoose);

const Order = mongoose.model("Order", orderSchema);

const Product = mongoose.model("Product", productsSchema);

const Credential = new mongoose.model("Credential", credentialsSchema);

const User = mongoose.model("User", usersSchema);



passport.use(Credential.createStrategy());


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Credential.findById(id, function(err, user) {
    done(err, user);
  });
});



app.get("/flash", function(req, res){
  req.flash("info", "Flash is back!");
  res.redirect('/login');
});

var username1;

app.get("/login", function( req, res) {
    var t = req.session.passport;
    if (t === undefined) {
     req.flash("none", "");
      res.render("login",{ message: req.flash("none") });
    } else {
        res.redirect("/productos2");
    }
});

app.get("/registrate/:token", function(req, res) {
   User.findOne({ registerToken: req.params.token, registerExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash("error", "Password reset token is invalid or has expired.");
      return res.redirect("/registrate1");
    }
    res.render("registrate");
  });
});


app.post("/registrate/:token", function(req, res, next) {
    
    async.waterfall([
    function(done) {
      User.findOne({ registerToken: req.params.token, registerExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash("error", "Password reset token is invalid or has expired.");
          return res.redirect("back");
        } 
          
           let username = req.body.username; 
           let password = req.body.password;
          
        Credential.register({username: username}, password, function(err, user){
        if(err) {
            console.log(err);
            res.redirect("/registrate");
        } else {
            passport.authenticate("local")(req, res, function() {
                
                res.redirect("/productos2");
            });
        }
     });
          
      });
    },
   async function(token, user, done) {
      var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
    port: 465, //465
    secure: true, // true for 465, false for other ports
    auth: {
      user: "++++++++@gmail.com", 
      pass: process.env.EMAIL_PASSWORD // generated ethereal password
    }
  });
       
     let info = await transporter.sendMail({
    from: "<+++++++@gmail.com>", // sender address
    to: '"' + user1.username + '"', // list of receivers
    subject: "Confirmacion de Registro", // Subject line
    text: "Felicidades ya estas registrado, ahora tienes accesso para ordenar" // plain text body // html body
  });
    }
  ], function(err) {
    console.log(err);
  });
   });
   
    
    app.post("/login", function(req, res) {
        
     username1 = req.body.username;
        
     const user = new Credential ({
        username: req.body.username,
        password: req.body.password
    });
    
    Credential.findOne({username: req.body.username}, function(err, found) {
        if (found === null) {
            req.flash("info", "Email o Contraseña incorrecta");
            res.render("login", { message: req.flash("info") });
        } else {
            req.login(user, function(err) {
                if (err) {
                    console.log(err);
                 } else {
                     passport.authenticate("local")(req, res, function(err) {
                     res.redirect("/productos2");
                });
              }
           });
        }
     });   
   });

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
     Order.deleteMany({session: session1}, function(err) {
         if (err) {
             console.log(err)
         } else {
         console.log("order deleted");
         }
      });
});

function checkO(para) {
        if (para === "") {
            console.log("Missing number");
        }
}

var productName;

var ordersArray = [];

var totalPrice; 



app.get("/", function(req, res) {
    res.render("fullstack");
});

app.get("/productos2", function (req, res){
    if(req.isAuthenticated()) {
    var str = req.session.passport;
    var str1 = JSON.stringify(str.user);
    str1.replace(/['"]+/g, '');
    session1 = str1;
   Order.countDocuments({session:  session1}, function(err, c) {
         res.render("productos2",{cart: c});
      });
    } else {
       res.redirect("/login");
    }
});

app.get("/cambio", function(req, res) {
    if(req.isAuthenticated()) {
        req.flash("none", "");
        if(req.session.passport === undefined) {
            res.redirect("/login");
        }
        Order.countDocuments({session:  session1}, function(err, c) {
         res.render("cambio",{cart: c, message: req.flash("none") });
      });
    } else {
       res.redirect("/login");
    }
});

app.get("/bisbandera2", function(req, res) {
  if(req.isAuthenticated()) { 
       req.flash("none", "");
      if(req.session.passport === undefined) {
            res.redirect("/login");
        }
      Order.countDocuments({session:  session1}, function(err, c) {
         res.render("bisbandera2",{cart: c, message: req.flash("none")});
      });
    } else {
       res.redirect("/login");
    }
});

app.get("/rodos2", function(req, res) {
    if(req.isAuthenticated()) {  
        req.flash("none", "");
        if(req.session.passport === undefined) {
            res.redirect("/login");
        }
      Order.countDocuments({session:  session1}, function(err, c) {
         res.render("rodos2",{cart: c,  message: req.flash("none")});
      });
    } else {
       res.redirect("/login");
    }
});

app.get("/rodos3", function(req, res) {
    if(req.isAuthenticated()) {  
         req.flash("none", "");
        if(req.session.passport === undefined) {
            res.redirect("/login");
        }
      Order.countDocuments({session: session1}, function(err, c) {
         res.render("rodos3",{cart: c, message: req.flash("none")});
      });
    } else {
       res.redirect("/login");
    }
});


app.get("/poleas2", function(req, res) {
    if(req.isAuthenticated()) { 
        req.flash("none", "");
        if(req.session.passport === undefined) {
            res.redirect("/login");
        }
     Order.countDocuments({session: session1}, function(err, c) {
         res.render("poleas2",{cart: c, message: req.flash("none")});
      });
    } else {
       res.redirect("/login");
    }
});

app.get("/faja2", function(req, res) {
    if(req.isAuthenticated()) {
        req.flash("none", "");
        if(req.session.passport === undefined) {
            res.redirect("/login");
        }
      Order.countDocuments({session: session1}, function(err, c) {
         res.render("faja2",{cart: c, message: req.flash("none")});
      });
    } else {
       res.redirect("/login");
    }
});

app.get("/pichachas2", function(req, res) { 
    if(req.isAuthenticated()) { 
          req.flash("none", "");
        if(req.session.passport === undefined) {
            res.redirect("/login");
        }
      Order.countDocuments({session: session1}, function(err, c) {
         res.render("pichachas2",{cart: c, message: req.flash("none")});
      });
    } else {
       res.redirect("/login");
    }
});


app.get("/camisas2", function(req, res) {
    if(req.isAuthenticated()) {  
          req.flash("none", "");
        if(req.session.passport === undefined) {
            res.redirect("/login");
        }
      Order.countDocuments({session: session1}, function(err, c) {
         res.render("camisas2",{cart: c, message: req.flash("none")});
      });
    } else {
       res.redirect("/login");
    }
});

app.get("/hule-redondo2", function(req, res) {
     if(req.isAuthenticated()) {
          req.flash("none", "");
         if(req.session.passport === undefined) {
            res.redirect("/login");
        }
      Order.countDocuments({session: session1}, function(err, c) {
         res.render("hule-redondo2",{cart: c, message: req.flash("none")});
      });
    } else {
       res.redirect("/login");
    }
});

app.get("/hule-cuadrado2", function(req, res) {
    if(req.isAuthenticated()) {  
         req.flash("none", "");
        if(req.session.passport === undefined) {
            res.redirect("/login");
        }
    Order.countDocuments({session: session1}, function(err, c) {
         res.render("hule-cuadrado2",{cart: c, message: req.flash("none")});
      });
    } else {
       res.redirect("/login");
    }
});

app.get("/hule-rectangular2", function(req, res) {
    if (req.isAuthenticated()) {  
         req.flash("none", "");
        if(req.session.passport === undefined) {
            res.redirect("/login");
        }
    Order.countDocuments({session: session1}, function(err, c) {
         res.render("hule-rectangular2",{cart: c, message: req.flash("none")});
      });
    } else {
       res.redirect("/login");
    }
});

app.get("/destapador2", function(req, res) {
    if(req.isAuthenticated()) { 
         req.flash("none", "");
        if(req.session.passport === undefined) {
            res.redirect("/login");
        }
    Order.countDocuments({session: session1}, function(err, c) {
         res.render("destapador2",{cart: c, message: req.flash("none")});
      });
    } else {
       res.redirect("/login");
    }
});

app.get("/masillador2", function(req, res) {
     if(req.isAuthenticated()) {
          req.flash("none", "");
         if(req.session.passport === undefined) {
            res.redirect("/login");
        }
    Order.countDocuments({session: session1}, function(err, c) {
         res.render("masillador2",{cart: c, message: req.flash("none")});
      });
    } else {
       res.redirect("/login");
    }
});

app.get("/lijador2", function(req, res) {
    if(req.isAuthenticated()) {
         req.flash("none", "");
        if(req.session.passport === undefined) {
            res.redirect("/login");
        }
    Order.countDocuments({session: session1}, function(err, c) {
         res.render("lijador2",{cart: c, message: req.flash("none")});
      });
    } else {
       res.redirect("/login");
    }
});

app.get("/sapos2", function(req, res) {
    if(req.isAuthenticated()) { 
        req.flash("none", "");
        if(req.session.passport === undefined) {
            res.redirect("/login");
        }
    Order.countDocuments({session: session1}, function(err, c) {
         res.render("sapos2",{cart: c, message: req.flash("none")});
      });
    } else {
       res.redirect("/login");
    }
});

app.get("/seccion-bisagras2", function(req, res) {
    if(req.isAuthenticated()) {
        req.flash("none", "");
        if (req.session.passport === undefined) {
        res.redirect("/login");
    } 
    Order.countDocuments({session: session1}, function(err, c) {
         res.render("seccion-bisagras2",{cart: c, message: req.flash("none")});
      });
    } else {
       res.redirect("/login");
    }
});

app.get("/seccion-cafe2", function(req, res) {
     if(req.isAuthenticated()) { 
         req.flash("none", "");
         if (req.session.passport === undefined) {
        res.redirect("/login");
    } 
    Order.countDocuments({session: session1}, function(err, c) {
         res.render("seccion-cafe2",{cart: c, message: req.flash("none")});
      });
    } else {
       res.redirect("/login");
    }
});

app.get("/seccion-hule2", function(req, res) {
   if(req.isAuthenticated()) {
       req.flash("none", "");
        if (req.session.passport === undefined) {
        res.redirect("/login");
    } 
    Order.countDocuments({session: session1}, function(err, c) {
         res.render("seccion-hule2",{cart: c, message: req.flash("none")});
      });
    } else {
       res.redirect("/login");
    }
});

app.get("/forgot", function(req, res) {
    res.render("forgot"); 
});

var amount;

app.get("/order", function(req, res) {
     if(req.isAuthenticated()) {
    if (req.session.passport === undefined) {
        res.redirect("/login");
    } 
       
 Order.aggregate([
     
     { $match: { session: session1 } },
    { $group: {
        _id: null,
        totalAmount: { $sum: '$total' }
    }
 }, {
    $project: {
        _id: 0
    } }]).exec(function (err , doc) {
                         if (doc[0] === undefined) {
                             res.redirect("/productos2");
                         } else {
                         console.log(doc);
                         amount = doc[0].totalAmount;
                         console.log(doc[0].totalAmount); 
                         Order.find({session: session1 }, function(err, data) {
                         res.render("order", {ordenItem: data, totalAmount: amount}); 
                       }); 
                         }
                  });
     } else {
       res.redirect("/login");
    }
});


app.post("/order", function(req, res) {
    

    
     Order.aggregate([
     
     { $match: { session: session1 } },
    { $group: {
        _id: null,
        totalAmount: { $sum: '$total' }
    }
 }, {
    $project: {
        _id: 0
    } }]).exec(function (err , doc) {
       if (doc[0] === undefined) {
             res.redirect("/productos2");
       } else {
              console.log(doc);
              amount = doc[0].totalAmount;
              console.log(doc[0].totalAmount); 
              Order.find({session: session1 }, function(err, data) {
                // async..await is not allowed in global scope, must use a wrapper
                async function main(){

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                 port: 465, //465
                secure: true, // true for 465, false for other ports
                auth: {
                 user: "++++++@gmail.com", 
                 pass: process.env.EMAIL_PASSWORD // generated ethereal password
              }
            });
                var amount = [];
                data.forEach(function(item){
                   amount.push(item.amount);
                   amount.push(item.name);
                  });
                 //send mail with defined transport object
                 let info = await transporter.sendMail({
                  from: '<+++++++@gmail.com>', // sender address
                  to: "+++++++@hotmail.com", // list of receivers
                  subject: "Orden PAPA!", // Subject line
                  html: "<h3>" + amount + "</h3>" +
                     "<h3>" + username1 + "</h3>"
                 // plain text body // html body
              });
            }
            main().catch(console.error); 
            async function main(){

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                 port: 465, //465
                secure: true, // true for 465, false for other ports
                auth: {
                 user: "+++++++@gmail.com", 
                 pass: process.env.EMAIL_PASSWORD // generated ethereal password
              }
            });
                 //send mail with defined transport object
                 let info = await transporter.sendMail({
                  from: '<+++++++@gmail.com>', // sender address
                  to: '"' + username1 + '"', // list of receivers
                  subject: "Confirmacion de orden", // Subject line
                  text: "Gracias por tu orden, estaremos en contacto, en la siguiente hora"
                 // plain text body // html body
              });
            }
             main().catch(console.error);        
         }); 
        }
        });

  res.redirect("/logout");
});



app.post("/cambio", function(req, res) {
    var inputValue = req.body.vote;
    if (inputValue == "add") {
    if (req.body.option === "" || productName === undefined ) {
        req.flash("number", "No elegiste tu producto o una cantidad");
         Order.countDocuments({session:  session1}, function(err, c) {
        res.render("cambio", {cart: c, message: req.flash("number") });
         }); 
        } else {
    var cantidad = req.body.option;
    var name = productName.name;
    var price = productName.price;
    totalPrice = cantidad * price; 
     const order = new Order ({
         session: session1,
        amount: cantidad,
         name: name,
        price: price,
         total: totalPrice
    });
    order.save();
    console.log(order);
    productName = undefined;
    res.redirect("/cambio");
    }
    }
});


app.post("/bisbandera2", function(req, res) {
    var inputValue = req.body.vote;
    if (inputValue == "add") {
  if (req.body.option === "" || productName === undefined ) {
        req.flash("number", "Vuelve a elegir tu producto y añade una cantidad");
         Order.countDocuments({session: session1}, function(err, c) {
        res.render("bisbandera2", {cart: c, message: req.flash("number") });
         });
    } else {
    var cantidad = req.body.option;
    var name = productName.name;
    var price = productName.price;
    totalPrice = cantidad * price;
     const order = new Order ({
         session: session1,
        amount: cantidad,
         name: name,
        price: price,
         total: totalPrice
    }); 
    order.save();
    console.log(order);
    productName = undefined; 
    res.redirect("bisbandera2"); 
    }
    }
});

app.post("/rodos2",  function(req, res) {
    var inputValue = req.body.vote;
    if (inputValue == "add") { 
    if (req.body.option === "" || productName === undefined ) {
         var str = req.session.passport;
         var str1 = JSON.stringify(str.user);
          str1.replace(/['"]+/g, '');
        req.flash("number", "No elegiste tu producto o una cantidad");
         Order.countDocuments({session: session1}, function(err, c) {
        res.render("rodos2", {cart: c, message: req.flash("number") });
         }); 
        } else {  
    var cantidad = req.body.option;
    var name = productName.name;
    var price = productName.price;
     const order = new Order ({
         session: session1,
        amount: cantidad,
         name: name,
        price: price,
         total: totalPrice
    }); 
    order.save();
    console.log(order);
    productName = undefined;
    res.redirect("rodos2");  
    }
    }
});

app.post("/rodos3", function(req, res) {
    var inputValue = req.body.vote;
    if (inputValue == "add") { 
    if (req.body.option === "" || productName === undefined ) {
        req.flash("number", "No elegiste tu producto o una cantidad");
         Order.countDocuments({session: session1}, function(err, c) {
        res.render("rodos3", {cart: c, message: req.flash("number") });
         }); 
        } else {
    var cantidad = req.body.option;
    var name = productName.name;
    var price = productName.price;
    totalPrice = cantidad * price;
     const order = new Order ({
         session: session1,
        amount: cantidad,
         name: name,
        price: price,
         total: totalPrice
    });
     order.save();    
    console.log(order); 
    res.redirect("/rodos3");
        }
    }
});

app.post("/poleas2", function(req, res) {
    var inputValue = req.body.vote;
    if (inputValue == "add") {
        if (req.body.option === "" || productName === undefined ) {
        req.flash("number", "No elegiste tu producto o una cantidad");
         Order.countDocuments({session: session1}, function(err, c) {
        res.render("poleas2", {cart: c, message: req.flash("number") });
         }); 
        } else {
    var cantidad = req.body.option;
    var name = productName.name;
    var price = productName.price;
    totalPrice = cantidad * price;
     const order = new Order ({
         session: session1,
        amount: cantidad,
         name: name,
        price: price,
         total: totalPrice
    });
     order.save();    
    console.log(order);
    res.redirect("/poleas2");
        }
    }
});

app.post("/faja2", function(req, res) {
    var inputValue = req.body.vote;
    if (inputValue == "add") {
        if (req.body.option === "" || productName === undefined ) {
        req.flash("number", "No elegiste tu producto o una cantidad");
         Order.countDocuments({session: session1}, function(err, c) {
        res.render("faja2", {cart: c, message: req.flash("number") });
         }); 
        } else {
    var cantidad = req.body.option;
    var name = productName.name;
    var price = productName.price;
    totalPrice = cantidad * price;
     const order = new Order ({
         session: session1,
        amount: cantidad,
         name: name,
        price: price,
         total: totalPrice
    });
     order.save();    
    console.log(order);    
    res.redirect("/faja2");
        }
    }
});

app.post("/pichachas2", function(req, res) {
    var inputValue = req.body.vote;
    if (inputValue == "add") {
        if (req.body.option === "" || productName === undefined ) {
        req.flash("number", "No elegiste tu producto o una cantidad");
         Order.countDocuments({session: session1}, function(err, c) {
        res.render("pichachas2", {cart: c, message: req.flash("number") });
         }); 
        } else {
    var cantidad = req.body.option;
    var name = productName.name;
    var price = productName.price;
    totalPrice = cantidad * price;
     const order = new Order ({
         session: session1,
        amount: cantidad,
         name: name,
        price: price,
         total: totalPrice
    });
     order.save();    
    console.log(order);
    res.redirect("/pichachas2");
        }
    }
});

app.post("/camisas2", function(req, res) {
    var inputValue = req.body.vote;
    if (inputValue == "add") {
        if (req.body.option === "" || productName === undefined ) {
        req.flash("number", "No elegiste tu producto o una cantidad");
         Order.countDocuments({session: session1}, function(err, c) {
        res.render("camisas2", {cart: c, message: req.flash("number") });
         }); 
        } else {
    var cantidad = req.body.option;
    var name = productName.name;
    var price = productName.price;
    totalPrice = cantidad * price;
     const order = new Order ({
         session: str1,
        amount: cantidad,
         name: name,
        price: price,
         total: totalPrice
    });
     order.save();    
    console.log(order);
    res.redirect("/camisas2");
        }
    }
});

app.post("/hule-cuadrado2", function(req, res) {
    var inputValue = req.body.vote;
    if (inputValue == "add") {
        if (req.body.option === "" || productName === undefined ) {
        req.flash("number", "No elegiste tu producto o una cantidad");
         Order.countDocuments({session: session1}, function(err, c) {
        res.render("hule-cuadrado2", {cart: c, message: req.flash("number") });
         }); 
        } else {
    var cantidad = req.body.option;
    var name = productName.name;
    var price = productName.price;
    var cantidadA = cantidad;    
    totalPrice = (cantidadA / 100) * price;
     const order = new Order ({
         session: session1,
        amount: cantidad,
         name: name,
        price: price,
         total: totalPrice
    });
     order.save();    
    console.log(order);
    res.redirect("/hule-cuadrado2");
        }
    }
});

app.post("/hule-redondo2", function(req, res) {
    var inputValue = req.body.vote;
    if (inputValue == "add") {
        if (req.body.option === "" || productName === undefined ) {
        req.flash("number", "No elegiste tu producto o una cantidad");
         Order.countDocuments({session: session1}, function(err, c) {
        res.render("hule-redondo2", {cart: c, message: req.flash("number") });
         }); 
        } else {
    var cantidad = req.body.option;
    var name = productName.name;
    var price = productName.price;
    var cantidadA = cantidad;    
    totalPrice = (cantidadA / 100) * price;
     const order = new Order ({
         session: session1,
        amount: cantidad,
         name: name,
        price: price,
         total: totalPrice
    });
     order.save();    
    console.log(order);
    res.redirect("/hule-redondo2");
        }
    }
});

app.post("/hule-rectangular2", function(req, res) {
    var inputValue = req.body.vote;
    if (inputValue == "add") {
        if (req.body.option === "" || productName === undefined ) {
        req.flash("number", "No elegiste tu producto o una cantidad");
         Order.countDocuments({session: session1}, function(err, c) {
        res.render("hule-rectangular2", {cart: c, message: req.flash("number") });
         }); 
        } else {
    var cantidad = req.body.option;
    var name = productName.name;
    var price = productName.price;
    var cantidadA = cantidad;    
    totalPrice = (cantidadA / 100) * price;
     const order = new Order ({
         session: session1,
        amount: cantidad,
         name: name,
        price: price,
         total: totalPrice
    });
     order.save();    
    console.log(order);
    res.redirect("/hule-rectangular2");
        }
    }
});

app.post("/destapador2", function(req, res) {
    var inputValue = req.body.vote;
    if (inputValue == "add") {
        if (req.body.option === "" || productName === undefined ) {
        req.flash("number", "No elegiste tu producto o una cantidad");
         Order.countDocuments({session: session1}, function(err, c) {
        res.render("destapador2", {cart: c, message: req.flash("number") });
         }); 
        } else {
    var cantidad = req.body.option;
    var name = productName.name;
    var price = productName.price;
     var cantidadA = cantidad;    
    totalPrice = (cantidadA / 12) * price;
     const order = new Order ({
         session: session1,
        amount: cantidad,
         name: name,
        price: price,
         total: totalPrice
    });
     order.save();    
    console.log(order);
    res.redirect("/destapador2");
        }
    }
});

app.post("/masillador2", function(req, res) {
    var inputValue = req.body.vote;
    if (inputValue == "add") {
        if (req.body.option === "" || productName === undefined ) {
        req.flash("number", "No elegiste tu producto o una cantidad");
         Order.countDocuments({session: session1}, function(err, c) {
        res.render("masillador2", {cart: c, message: req.flash("number") });
         }); 
        } else {
    var cantidad = req.body.option;
    var name = productName.name;
    var price = productName.price;
    var cantidadA = cantidad;    
    totalPrice = (cantidadA / 100) * price;
     const order = new Order ({
         session: session1,
        amount: cantidad,
         name: name,
        price: price,
         total: totalPrice
    });
     order.save();    
    console.log(order);
    res.redirect("/masillador2");
        }
    }
});

app.post("/sapos2", function(req, res) {
    var inputValue = req.body.vote;
    if (inputValue == "add") {
        if (req.body.option === "" || productName === undefined ) {
        req.flash("number", "No elegiste tu producto o una cantidad");
         Order.countDocuments({session: session1}, function(err, c) {
        res.render("sapos2", {cart: c, message: req.flash("number") });
         }); 
        } else {
    var cantidad = req.body.option;
    var name = productName.name;
    var price = productName.price;
    var cantidadA = cantidad;   
    totalPrice = (cantidadA / 100) * price;
     const order = new Order ({
         session: session1,
        amount: cantidad,
         name: name,
        price: price,
         total: totalPrice
    });
    order.save();    
    console.log(order);
    res.redirect("/sapos2");
        }
    }
});


app.post("/delete", function(req, res) {
    const check = req.body.checkbox;
    
    Order.findByIdAndRemove(check, function(err){
        if (!err) {
            console.log("Succesfully deleted");
            res.redirect("/order");
        }
    });
});


app.post("/clicked", (req, res) => {
    var pro = (req.body.name);
    Number(pro);
    Product.findOne({"id": pro}, function(err, foundLList) {
        if(err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                error: err
            });
        } else {
            productName = foundLList;
            return res.status(200).json({
                ok: true,
                data: foundLList
            });
        }
    }); 
});


app.post("/forgot", function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      Credential.findOne({ username: req.body.username }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
          console.log(err);
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
   async function(token, user, done) {
      var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
    port: 465, //465
    secure: true, // true for 465, false for other ports
    auth: {
      user: "+++++++@gmail.com", 
      pass: process.env.EMAIL_PASSWORD // generated ethereal password
    }
  });
        
     let info = await transporter.sendMail({
    from: '<+++++++@gmail.com>', // sender address
    to: '"' + req.body.username + '"', // list of receivers
    subject: "Cambio de Contraseña", // Subject line
    text: 'Estas reciviendo este correo por que tu (o alguien mas) a iniciado el proceso para el cambio de contraseña.\n\n' +
          'Haz click en el siguiente link, o pegalo en tu  buscador para completar el proceso:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'Si no haz iniciado el proceso, por favor contactanos a +(502) 5323-2245\n' // plain text body // html body
  });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect("/forgot");
  });
});


app.get("/reset/:token", function(req, res) {
  Credential.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash("error", "Password reset token is invalid or has expired.");
      return res.redirect("/forgot");
    }
    res.render("reset");
  });
});


var user1;


app.post("/reset/:token", function(req, res, next) {
  async.waterfall([
    function(done) {
      Credential.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash("error", "Password reset token is invalid or has expired.");
          return res.redirect("back");
        } 
        
          if(req.body.password == req.body.confirm) {
              user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
                  
        user.save(function(err) {
          req.logIn(user, function(err) {
                  done(err, user);
                 });
              });
            })
          } else {
              req.flash("error", "Passwords dont match");
              return res.redirect("back");
          }
          
           user1 = user;
      });
    },
   async function(token, user, done) {
      var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
    port: 465, //465
    secure: true, // true for 465, false for other ports
    auth: {
      user: "++++++++@gmail.com", 
      pass: process.env.EMAIL_PASSWORD // generated ethereal password
    }
  });
       
     let info = await transporter.sendMail({
    from: "<++++++@gmail.com>", // sender address
    to: '"' + user1.username + '"', // list of receivers
    subject: "Hello ✔", // Subject line
    text: 'This is a confirmation that the password for your account' + user1.username + 'has just been changed.\n' // plain text body // html body
  });
    }
  ], function(err) {
    console.log(err);
  });
});


    
    app.listen(process.env.PORT || 8000, function(req, res) {
    console.log("Hello");
});
