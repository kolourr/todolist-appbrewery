const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js")
const mongoose = require('mongoose')
const _ = require('lodash')
const PORT = 3000
require('dotenv').config()




app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

mongoose.connect(process.env.DB_STRING, {dbName: 'todolistDBToday'}, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});  
 
const itemsSchema = {
  name: String
}

const listsSchema = {
  name: String,
  items: [itemsSchema]
}

const Item = mongoose.model('Item', itemsSchema)
const List = mongoose.model('List', listsSchema)

const itemOne = new Item ({
  name: 'This is the First item in the list'
})

const itemTwo = new Item ({
  name: 'This is the Second item in the list'
})

const itemthree = new Item ({
  name: 'This is the Third item in the list'
})

const defaultListItems = [itemOne, itemTwo, itemthree]


app.get('/', (req, res) => {

  Item.find({}, (err, listItems) => {
    if(listItems.length == 0){
      Item.insertMany(defaultListItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Saved Default Items to todolistDBToday DB");
        }
      })
      res.redirect('/')
    } else{
    res.render('list', {listTitle: date.getDate(), newListItems: listItems})
  }

})
})

app.get('/:newListName', (req,res) => {
  const newName = _.capitalize(req.params.newListName)

  List.findOne({name: newName}, (err,foundList) => {
    if(!err){
      if(!foundList){
        const list = new List({
          name: newName,
          items: defaultListItems
        });
        list.save()
        res.redirect('/' + newName)
      }else{
        res.render('list', {listTitle: foundList.name, newListItems: foundList.items})
      }
    }
  })

})

app.post('/delete', (req,res) => {
  const itemID = req.body.checkbox
  const listName = req.body.listName 

  if(listName == date.getDate()){
    Item.findByIdAndRemove(itemID, (err) => {
      if(!err){
        console.log('Successfully Deleted Item')
        res.redirect('/')
      }
    })
  }else{
    List.findOneAndUpdate({name:listName}, {$pull: {items: {_id: itemID}}}, (err, foundList) => {
      if(!err){
        console.log('Successfully Deleted Item')
        res.redirect('/' + listName)
      }
    })
  }

})





app.post('/', (req, res) => {
  const itemName = req.body.newItem 
  const listTitle = req.body.list 

  const item = new Item({
    name: itemName
  })

  if(listTitle == date.getDate()){
    item.save()
    res.redirect('/')
  }else{
    List.findOne({name: listTitle}, (err, foundList) => {
      foundList.items.push(item)
      foundList.save()
      res.redirect('/' + listTitle)
    })
  }

})


 
app.get("/about", function(req, res){
  res.render('about');
});

app.listen(process.env.PORT || PORT, function() {
  console.log(`Server is running on PORT ${PORT}`);
});
