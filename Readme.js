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




