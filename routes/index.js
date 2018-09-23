//=====================================================
//          SET UP EXPRESS-ROUTER.
//=====================================================

    var express     = require("express");
    var router      = express.Router();
    var passport    = require("passport");
    var User        = require("../models/user");
    var Campground  = require("../models/campground");
    
//======================================================
//                  ROOT ROUTE
//======================================================

    router.get("/",function(req, res){
        res.render("landing"); 
    });

//======================================================
//                  AUTH ROUTES
//======================================================

//======================================================
// SHOW AND HANDLE SIGN UP LOGIC - REGISTER
//======================================================
   
    // show register form
    router.get("/register",function(req, res){
        res.render("register",{page:"register"}); 
    });

    // Handle sign up logic
    router.post("/register",function(req, res){
        
        var newUser = new User(
            {
            username: req.body.username, 
            firstName: req.body.firstName,
            lastName: req.body.lastName,    
            email: req.body.email,
            avatar: req.body.avatar
            });
            
        if(req.body.adminCode === "secretcode"){
            newUser.isAdmin = true;
        }
        User.register(newUser,req.body.password, function(err, user){ // store creazy HASHHH! <3
         if(err){
             console.log(err);
             return res.render("register", {error: err.message});
         }
         passport.authenticate("local")(req, res, function(){
         req.flash("success","Successfully Signed Up! Nice to meet you " + req.body.username);
         res.redirect("/campgrounds");
        });
    }); 
    });

//======================================================
//      SHOW AND HANDLE LOGIN LOGIC - LOGIN
//======================================================
    // show login form
    router.get("/login",function(req, res){
        res.render("login",{page:"login"}); 
    });
    
    // handliong login logic
    router.post("/login", passport.authenticate("local",
            //middleware
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login",
        failureFlash:true,
        successFlash: "Welcome to YelpCamp!" 
    }), 
    function(req, res){
    });
//======================================================
//                  LOGOUT ROUTE
//======================================================

    router.get("/logout",function(req, res){
        req.logout();
        req.flash("success", "Logged you out!");
        res.redirect("/campgrounds");
    });

//======================================================
//                  USER PROFILE
//======================================================
router.get("/users/:id", function(req, res) {
   User.findById(req.params.id, function(err, foundUser){
      if(err){
          req.flash("error","Something went wrong.");
          return res.redirect("/");
      } else {
          Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
            if(err){
                req.flash("error", "something went wrong.");
               return res.redirect("/");
            } else{ 
            res.render("users/show", {user: foundUser, campgrounds: campgrounds});
            }
          });
      }
   });
});
//-----------------EXPORT ROUTER------------------------
    module.exports = router;