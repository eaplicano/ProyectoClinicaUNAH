const express = require("express");
const router = express.Router();

const passport = require("passport");
const { isLoggedIn } = require("../lib/auth");
const session = require("express-session");
const { Session } = require("express-session");
const { Passport } = require("passport");
// const passport1 = require('./src/lib/passport.js')
// const validar = passport.activo;
// const activo = passport.va

// SIGNUP
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post(
  "/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

// SINGIN
router.get("/signin", (req, res) => {
  req.sessionID;
  // console.log(req.sessionID);
  // passport.validacioncodigo()
  // console.log(validar);
  // if(activo!=""){
  //   res.redirect('profile');
  // }
  // else{
  res.render("auth/signin");
  // }
});
// router.get('/signin', isLoggedIn, (req, res) => {
//   if(isLoggedIn){
//     res.render('profile');
//   }
//   else{
//     res.render('auth/signin');
//   }

// console.log(isLoggedIn);

// });

router.post("/signin", (req, res, next) => {
  req.check("USUARIO", "Username is Required").notEmpty();
  req.check("CONTRASEÑA", "Password is Required").notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash("message", errors[0].msg);
    res.redirect("/signin");
  }
  // console.log(passport.authenticate('local.signin'));
  passport.authenticate("local.signin", {
    successRedirect: "/expediente",
    failureRedirect: "/signin",
    failureFlash: true,
  })(req, res, next);
  // if( passport.authenticate('local.signin')){
  //   console.log('ingreso')
  //   res.redirect('/profile')
  // }
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile");
});

module.exports = router;
