const express = require('express');
router = express.Router();

const {root,home,signup,post_signup,login,post_login,about,contacts,compose,post_compose,story,my_space,logout,resetPassword,postReset} = require("../controllers/root");

router.get("/",root);
router.get("/home",home);
router.get("/signup",signup);
router.post("/signup",post_signup);
router.get("/login",login);
router.post("/login", post_login);
router.get("/about",about);
router.get("/contact",contacts);
router.get("/compose",compose);
router.post("/compose",post_compose);
router.get("/posts/:title",story);
router.get("/myspace",my_space);
router.get("/logout",logout);
router.get("/reset",resetPassword);
router.post("/reset",postReset);


module.exports = router;