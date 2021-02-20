const express = require("express");
require('dotenv').config()
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
app.use(express.static(__dirname + '/client'))
var mongoose = require("mongoose");
const uri = "mongodb+srv://bdzanko1:PzrHmyh4OjcCabeP@cluster0.s4065.mongodb.net/baza?retryWrites=true&w=majority";
var items = require("./models/items")
var orders = require("./models/orders")
var orderItems = require("./models/orderItems")
const jwt = require('jsonwebtoken');
app.use(express.json())
var bcrypt = require("bcrypt");
var cors = require("cors");
const users = require("./models/users");
const { schema } = require("./models/users");
var cookieParser = require("cookie-parser");
var  count =0;
// Povezivanje sa bazom
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
try {
  mongoose.connect(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  console.log("Connected to db :)")
} catch (error) {
  console.log(error);
}


io.on('connection', (socket) => {
  console.log('a user is connected')
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

})

//Localhost:3000/createItem da kao admin kreira item
app.post("/createItem", authenticateToken, (req, res) => {
  if (req.user.user.role === 'admin') {
    var item = new items(req.body.item)
    console.log(req.body)
    item.save((err, doc) => {
      if (err) console.log(err);
      console.log("Succesefully inserted item");
    });
  } else return res.status(500)
})

app.get("/getItems",async (req,res)=>{
  console.log(count++)
 return res.json(await items.find())
})

app.post("/register", async (req, res) => {
  var user = new users(req.body)
  user.password = users.hashPassword(user.password)
  if (await users.exists({ email: user.email })) return res.status(500).send('error')
  user.save((err, doc) => {
    if (err) console.log(err);
    console.log("Succesefully registered user");
  });
  return res.status(200).json(user)
})

app.post("/makeOrder",authenticateToken, async (req,res)=>{
    const user = req.user.user;
    const order = new orders(req.body.order)
    order.user = user;
    const item = await items.find()
    const orderItem = new orderItems({"quantity":10})
    orderItem.item=item[1];
    orderItem.order=order;
    console.log({orderItem})
    order.save((err,res)=>{
      if(err) throw err
    })
    orderItem.save((err,res)=>{
      if(err) throw err
    })

})

app.get('/posts', authenticateToken, async (req, res) => {
  const user = await users.findOne({ email: req.user.user.email })
  console.log(req.user.user)
  return res.status(200).json(user)
})


//Login
app.post('/login', async (req, res) => {
  // Pristup useru 
  const user = await users.findOne({ email: req.body.email })
  const pw = users.hashPassword(req.body.password)
  if (user.isValid(req.body.password)) {
    const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1h"})
    res.cookie('token', token, { httpOnly: true });
    res.json({ token, user });
    console.log('DA')
  } else return res.status(500)
})


app.get('/logout', (req, res) => {
  res.cookie('token', null, { httpOnly: true });
  res.json({ 'OK': 'OK' });
})


function authenticateToken(req, res, next) {

  const token_2 = req.cookies.token
  if (token_2 == null) return res.sendStatus(401)

  jwt.verify(token_2, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

http.listen(3000, () => {
  console.log('listening on *:3000');
});