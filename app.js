const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js")
const mongoose = require('monogoose')
const _ = require('lodash')
const PORT = 3000
require('dotenv').config()




app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

mongoose.connect(process.env.DB_STRING, {dbName: 'todolistDB'}, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});  
 

 
app.get("/about", function(req, res){
  res.render("about.ejs");
});

app.listen(process.env.PORT || PORT, function() {
  console.log(`Server is running on PORT ${PORT}`);
});
