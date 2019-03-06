const express = require('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const config = require ('./config/database');
const path = require ('path');
const authentication = require ('./routes/authentication')(router);
const blogs = require ('./routes/blogs')(router);
const bodyParser = require('body-parser');
const cors =require('cors');

app.use(cors({
  origin : 'http://localhost:4200'
}));

mongoose.Promise = global.Promise;
mongoose.connect(config.uri , (err) =>{
  if (err){
    console.log('could not connect to the database' , err);
  }
  else {
    console.log('successfully connected to the database' , config.db);
  }
} );

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/authentication', authentication);
app.use('/blogs', blogs);
app.get('*' , (req , res)=>{
  res.sendFile(path.join( __dirname + '/public/index.html'));
});
app.listen(3000 , () =>{
  console.log('You are listening to port 3000');
});
