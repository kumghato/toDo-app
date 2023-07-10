//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://kumghatokhala:kumghatokhala@cluster0.y5n88nm.mongodb.net/todolistDB")

const todoSchema = mongoose.Schema({
  name: String
})

const Item = mongoose.model("Item", todoSchema)

const item1 = new Item(
  {
    name: "Welcome to the Todo App"
  },
)
const item2 = new Item(
  {
    name: "Click on + button to add an Item"
  },
)
const item3 = new Item(
  {
    name: "Check the Checkbox to Delete"
  },
)

const itemsArr = [item1, item2, item3]


app.get("/", function (req, res) {

  Item.find()
    .then((def) => { //def=default Items
      if (def.length === 0) {
        Item.insertMany(itemsArr)
          .then(() => {
            console.log("success")
          })
          .catch((err) => {
            console.log(err)
          })
        res.redirect('/')
      } else {
        res.render("list", { listTitle: "Today", newListItems: def });
      }
    })
    .catch((err) => {
      console.log(err)
    })



});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  })
  item.save()

  res.redirect('/')
});

app.post("/delete", function (req, res) {
  const checkedItemId = (req.body.checkbox)


  Item.findByIdAndRemove({ _id: checkedItemId })
    .then(() => {
      console.log("Success")
      res.redirect("/")

    })
    .catch((err) => {
      console.log(err)
    })

})

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
