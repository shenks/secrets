//notes in js so the colours are there
const md5 = require("md5");
const { AutoEncryptionLoggerLevel } = require("mongodb")

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

level 6: cookies & sessions (passport auth middleware)
              npm i passport 
              passport-local 
              passport-local-mongoose 
              express-session

            


