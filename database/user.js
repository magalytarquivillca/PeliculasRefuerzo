var mongoose = require("./connect");
var USERSCHEMA = new mongoose.Schema({
    nick: {
        type: String,
        required: [true, "El name es necesario"]
    },
    foto: {
        type: String,

    },
    email: {
        type: String,
        required: [true, " email es obligatorio"],
        validate: {
            validator: (value) => {
                return /^[\w\.]+@[\w\.]+\.\w{3,3}$/.test(value);
            },
            message: props => `${props.value} no es valido`
        }
        
    },
    password: {
        type: String,
        required: [true, "password obligatorio"],
    },
   
});
var USER = mongoose.model("user", USERSCHEMA);
module.exports = USER;