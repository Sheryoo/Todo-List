const router = require("express").Router();
const passport = require("passport");
const Todo = require("../models/todo");
const SheredUser = require("../models/user");

router.use((req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
});

router.get("/todos", async (req, res) => {
  try {
    const sharedUsers = await SheredUser.find({});
    const userTodos = await Todo.find({ user: req.user._id });
    const sharedTodos = await Todo.find({ sharedUser: req.user._id });
    res.render("index", {
      todos: userTodos,
      users: sharedUsers,
      shared: sharedTodos,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/login");
  }
});

router.get("/logout", async (req, res) => {
  try {
    req.logOut(() => {
      res.redirect("/login");
    });
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
  })
  .get("/edit/todo/:_id", async (req, res) => {
    const id = req.params;
    const todo = await Todo.findOne({ _id: id, user: req.user._id });
    todo.completed = !todo.completed;
    await todo
      .save()
      .then(() => {
        console.log("Status Changed Successfully !!!");
        res.redirect("/todos");
        let done = document.getElementById("done");
        done.style.display = "none";
      })
      .catch((err) => console.log(err));
  })
  .get("/share/todo/:_id", async (req, res) => {
    const id = req.params;
    const userTodos = await Todo.find({ user: req.user._id });
    for (let i = 0; i < userTodos.length; i++) {
      userTodos[i].sharedUser = id;
      userTodos[i].authentication = "onlyShow";
      let todo = userTodos[i];
      await todo
        .save()
        .then(() => {})
        .catch((err) => console.log(err));
    }
    console.log("Shared to User Successfully !!!");
    res.redirect("/todos");
  })
  .get("/shareedit/todo/:_id", async (req, res) => {
    const id = req.params;
    const userTodos = await Todo.find({ user: req.user._id });
    for (let i = 0; i < userTodos.length; i++) {
      userTodos[i].sharedUser = id;
      userTodos[i].authentication = "edit";
      let todo = userTodos[i];
      await todo
        .save()
        .then(() => {})
        .catch((err) => console.log(err));
    }
    console.log("Shared to User Successfully !!!");
    res.redirect("/todos");
  })
  .get("/shareauth/todo/:_id", async (req, res) => {
    const id = req.params;
    const userTodos = await Todo.find({ user: req.user._id });
    for (let i = 0; i < userTodos.length; i++) {
      userTodos[i].sharedUser = id;
      userTodos[i].authentication = "auth";
      let todo = userTodos[i];
      await todo
        .save()
        .then(() => {})
        .catch((err) => console.log(err));
    }
    console.log("Shared to User Successfully !!!");
    res.redirect("/todos");
  });

module.exports = router;
