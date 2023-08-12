const router = require("express").Router();
const passport = require("passport");
const Todo = require("../models/todo");

router.use((req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
});

router.get("/todos", async (req, res) => {
  try {
    const userTodos = await Todo.find({ user: req.user._id });
    res.render("index", { todos: userTodos });
  } catch (error) {
    console.error(error);
    res.redirect("/todos");
  }
});

router
  .post("/add/todo", async (req, res) => {
    try {
      const { todo } = req.body;
      const newTodo = new Todo({ user: req.user._id, todo });
      await newTodo
        .save()
        .then(() => {
          console.log("Successfully Added The Todo !!");
          res.redirect("/todos");
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.error(error);
      res.redirect("/todos");
    }
  })
  .get("/delete/todo/:_id", (req, res) => {
    const { _id } = req.params;
    Todo.deleteOne({ _id })
      .then(() => {
        console.log("Deleted The Todo Successfully !!!");
        res.redirect("/todos");
      })
      .catch((err) => console.log(err));
  });
module.exports = router;
