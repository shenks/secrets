//notes in js so the colours are there
const md5 = require("md5");
const { AutoEncryptionLoggerLevel, Code } = require("mongodb")

level 1: password

    const userSchema{
        email: String,
        password: String,
    };

level 2: encryption
    npm install mongoose-encryption

    const userSchema = new mongoose.Schema({
        email: String,
        password: String,
    });

    const secret = "Thisisourlittlesecret";

    userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

level 3: environment variables
    npm i dotenv

    require('dotenv').config() //at the very top

    remove const secret="thisisoursecret"

    create .env file in root dir
        SECRET=Thisisourlittlesecret

    app.js
        userSchema.plugin(encrypt, {
            //add this part
            secret: process.env.SECRET,
            encryptedFields: ["password"],
        });

    create a .gitignore file


level 4: Hashing
        npm i md5

        app.js:
        remove moongoose-encryption
        remove 
            userSchema.plugin(encrypt, {
            secret: process.env.SECRET,
            encryptedFields: ["password"],
            });

        //add 
        const md5 = require("md5");
const { Router } = require("express");
        app.post("/register", function (req, res) {
            const newUser = new User({
              email: req.body.username,
              password: md5(req.body.password), // here
            });

        app.post("/login", function (req, res) {
            const username = req.body.username;
            const password = md5(req.body.password); //here

level 5: salting with bcrypt //adding random characters
            //https://www.npmjs.com/package/bcrypt
            npm i bcrypt

            //remove
            const md5 = require("md5");

            //add
            const bcrypt = require("bcrypt");
            const saltRounds = 10;

            //register route
            app.post("/register", function (req, res) {
                //brcypt implementation
                bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                  const newUser = new User({
                    email: req.body.username,
                    password: hash,
                  });
              
                  newUser
                    .save()
                    .then(() => {
                      res.render("secrets");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                });
              });

              //login route
              app.post("/login", function (req, res) {
                const username = req.body.username;
                const password = req.body.password;
              
                User.findOne({ email: username })
                  .then((foundUser) => {
                    if (foundUser) {
                      bcrypt.compare(password, foundUser.password, function (err, result) {
                        if (err) {
                          console.log("Error comparing passwords:", err);
                        } else if (result === true) {
                          res.render("secrets");
                        } else {
                          console.log("Invalid password");
                        }
                      });
                    } else {
                      console.log("User not found");
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });

level 6: cookies & sessions (passport auth middleware)
              npm i passport 
              passport-local 
              passport-local-mongoose 
              express-session
              
    remove:
    require bcrypt and salting rounds
    empty out app.post /login and /register Routes

    insert:
    const session = require("express-session");
    const passport = require("passport");
    const passportLocalMongoose = require("passport-local-mongoose");
                
    //initialize session, use session package required above
    app.use(
        session({
          secret: "Our little secret.",
          resave: false,
          saveUninitialized: false,
        })
      );
      
      //initialize passport package
      app.use(passport.initialize());
      //use passport to deal with session
      app.use(passport.session());
      
      mongoose.connect(
        "mongodb+srv://shenkslee:test123@cluster0.eayyumt.mongodb.net/userDB",
        { useNewUrlParser: true }
      );
      
      const userSchema = new mongoose.Schema({
        email: String,
        password: String,
      });
      
      //plugin into userSchema just above
      userSchema.plugin(passportLocalMongoose);
      
      const User = new mongoose.model("User", userSchema);
      
      //using passport
      passport.use(User.createStrategy());
      
      passport.serializeUser(User.serializeUser());
      passport.deserializeUser(User.deserializeUser());
    //routes
    app.get("/secrets", function (req, res) {
        if (req.isAuthenticated()) {
          res.render("secrets");
        } else {
          res.redirect("/login");
        }
      });
      
      app.get("/logout", function (req, res) {
        req.logout(function (err) {
          if (err) {
            console.error("Error during logout:", err);
          }
          res.redirect("/");
        });
      });
      
      app.post("/register", function (req, res) {
        User.register(
          { username: req.body.username },
          req.body.password,
          function (err, user) {
            if (err) {
              console.log(err);
              res.redirect("/register");
            } else {
              passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
              });
            }
          }
        );
      });
      
      app.post("/login", function (req, res) {
        const user = new User({
          username: req.body.username,
          password: req.body.password,
        });
        req.login(user, function (err) {
          if (err) {
            console.log(err);
          } else {
            passport.authenticate("local")(req, res, function () {
              res.redirect("/secrets");
            });
          }
        });
      });

level 7: OAuth & google signin
      - granular access
      - read / read+write access
      - revoke access

      step 1: set up app in their developer console.
      step 2: redirect to authenticate 
      step 3: user logs in
      step 4: user grants Permission
      step 5: received auth Code
      step 6: exchange authcode for access token

      //implementation
      npm install passport-google-oauth2

      //google dev console
      configure oauth consent screen
      create oAuth client ID in credentials
        - authroised js origins
            -http://localhost:3000/auth/google/secrets
        -authorised redirect URIs
            -http://localhost:3000/auth/google/secrets
      get client ID: long string of random characters
      get client secret: string of random characters

      //.env file
        add it into .env file: CLIENT_ID=xxxxxxx
        add it into .env file: CLIENT_SECRET=xxxxxx

    //app.js

    add:
    const GoogleStrategy = require("passport-google-oauth2").Strategy;

    //add right before routes
    passport.use(new GoogleStrategy({
        clientID:     GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://yourdomain:3000/auth/google/callback",
        passReqToCallback   : true
      },
      function(request, accessToken, refreshToken, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));
    //install
    npm i mongoose-findorcreate

    const findOrCreate = require("mongoose-findorcreate");
    userSchema.plugin(findOrCreate);

    //google routes
    app.get(
        "/auth/google",
        passport.authenticate("google", { scope: ["email", "profile"] })
      );
      
      app.get(
        "/auth/google/secrets",
        passport.authenticate("google", {
          successRedirect: "/secrets",
          failureRedirect: "/login",
        })
      ); //google end

      //-----remove:------
      passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    // replace with
    passport.serializeUser(function (user, done) {
        console.log("Serializing user:", user);
        done(null, user.id);
      });
      
      passport.deserializeUser(function (id, done) {
        console.log("Deserializing user by ID:", id);
        User.findById(id)
          .then(function (user) {
            console.log("Deserialized user:", user);
            done(null, user);
          })
          .catch(function (err) {
            console.error("Error deserializing user:", err);
            done(err, null);
          });
      });
      
      //able to login w google but multiple ID for same acc
      add:
      const userSchema = new mongoose.Schema({
        email: String,
        password: String,
        googleId: String,//here
      });
      //now when logging in, won't create duplicate users

      //adding styling to google button
      //https://lipis.github.io/bootstrap-social/
      drag css folder into public/css
      
      in Header.ejs:
        add link to public/css/bootstrap-social.css
      
      in login and signup.ejs:
        add class "btn-social btn-google"

part 8: submitting secrets
      //change:
      const userSchema = new mongoose.Schema({
        email: String,
        password: String,
        googleId: String,
        secret: String, //add this
      });

      -----in app.js: //handle routes and secret submit      -----

      app.get("/secrets", function (req, res) {
        User.find({ secret: { $ne: null } })
          .then((foundUsers) => {
            if (foundUsers) {
              res.render("secrets", { usersWithSecrets: foundUsers });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });

      //rendering /submit and posting
      app.get("/submit", function (req, res) {
        if (req.isAuthenticated()) {
          res.render("submit");
        } else {
          res.redirect("/login");
        }
      });

      app.post("/submit", function (req, res) {
        if (req.isAuthenticated()) {
          const submittedSecret = req.body.secret;
          console.log(req.user.id);

          User.findById(req.user.id)
            .then((foundUser) => {
              if (foundUser) {
                foundUser.secret = submittedSecret;
                return foundUser.save();
              }
            })
            .then(() => {
              res.redirect("/secrets");
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          res.redirect("/login");
        }
      }); //part 8 end

      //secrets.ejs

      <% usersWithSecrets.forEach(function(user){ %>
        <p class="secret-text"><%=user.secret%></p>
        <% }); %>