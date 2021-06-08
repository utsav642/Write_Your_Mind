var express = require('express')
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const _ = require("lodash");

const session = require('express-session');
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

const User = require("../models/user");
const {Story} = require("../models/story");

const date = require("../date.js");

const homeStartingContent = "We believe, that we all somewhere sometimes want to document our feelings, our thoughts. We want to make the memories. We want to witness the day when our grandchildren will read those content and fantasize about how this present time could have been which will be the history for them at that time! \n Writing provides you that medium. It's one of the most beautiful way to express yourself. And, we provide you the platform to write. To really write YOUR MIND!";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

module.exports = {
    root(req,res){
        res.render("land",{Para : homeStartingContent});
    },

    home(req,res){
        if(req.isAuthenticated()){
          Story.find({status : "public"},function(err,foundUsers){
            if(err){
              console.log(err);
            }else{
              res.render("home",{Para : homeStartingContent,Stories : foundUsers,User: req.user.user});
            }
          });
        }else{
          res.redirect("/login");
        }
    },

    signup(req,res){
        res.render("signup");
    },

    post_signup(req,res){
        User.register({username: req.body.username, user: req.body.user}, req.body.password, function(err,user){
          if(err){
            console.log(err);
            res.redirect('/signup');
          }else{
            passport.authenticate("local")(req, res, function(){
              res.redirect("/home");
            });
          }
        });
    },

    login(req,res){
        res.render("login");
    },

    post_login(req, res){
        const user = new User({
          email: req.body.username,
          password: req.body.password
        });
      
        req.login(user, function(err) {
          if (err) {
            console.log(err);
          } else{
              passport.authenticate("local")(req, res, function(){
              res.redirect("/home");
              });
            }
          });
    },

    about(req,res){
        res.render("about",{Para : aboutContent});
    },

    contacts(req,res){
        res.render("contact",{Para : contactContent});
    },

    compose(req,res){
        if(req.isAuthenticated()){
          res.render("compose");
        }else{
          res.redirect("/login");
        }
    },

    post_compose(req,res){
        if(req.isAuthenticated()){
          const athr = req.user.user;
      
          const post = new Story({
            title : req.body.title,
            post : req.body.story,
            author : athr,
            category : req.body.category,
            status : req.body.reach,
            date: date.getDay()
          });
      
          post.save(function(err,result){
            if(err){
              console.log(err);
            }
          });
            
          req.user.stories.push(post);
          req.user.save();
          // }
          
          res.redirect("/home");
        }else{
          res.redirect("/login");
        }
    },

    story(req,res){

        if(req.isAuthenticated()){
          const toSearch = _.lowerCase(req.params.title);
      
          Story.findOne({title: toSearch},function(err,foundStory){
            if(err){
              console.log(err);
            }else{
              if(foundStory){
                res.render("post",{Title: foundStory.title,Content: foundStory.post});
              }else{
                console.log(req.params.title);
                console.log(toSearch);
              }
            }
          });
      
        } else{
          res.redirect("/login");
        }
      
      },

      my_space(req,res){
        if(req.isAuthenticated()){
          let currentDay = date.getDay();
          let flag = false;
          req.user.stories.forEach(function(story){
            if(story.date === currentDay && story.category === "diary"){
              flag = true;
              res.render("user-space",{Stories : req.user.stories,Today: true});
              // break;
            }
          });
          if(!flag){
            res.render("user-space",{Stories : req.user.stories,Today: false});
          }
        }else{
          res.redirect("/login");
        }
      },

      resetPassword(req, res){
        // if(req.isAuthenticated()){
            res.render("forgot.ejs");
        // }else{
            // res.redirect("/login");
        // }
      },

      postReset(req, res){
        User.findOne({username: req.body.username},function(err, foundUser){
            if(err){
                console.log(err);
            }else{
                foundUser.changePassword(req.body.opassword, req.body.npassword, function(err){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("password reset succesfully");
                        res.redirect("/login");
                    }
                });
            }
        });
      },

      logout(req,res){
        req.logout();
        res.redirect('/');
      }
}