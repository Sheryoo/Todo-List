const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user");

router.get("/", (req, res) => {
  res.render("register");
});
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser
      .save()
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => {
        res.redirect("/");
      });
  } catch (error) {
    console.error(error);
    res.redirect("/register");
  }
  // newRegister
  //   .save()
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/todos",
    failureRedirect: "/login",
  })
);
module.exports = router;
