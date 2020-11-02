var mongoose = require("./connect");
var USERSCHEMA = new mongoose.Schema({
    nick: {
        type: String,
        required: [true, "El nickname es necesario"]
    },
    foto: {
        type: String,

    },
    email: {
        type: String,
        required: [true, "El email es necesario"],
        validate: {
            validator: (value) => {
                return /^[\w\.]+@[\w\.]+\.\w{3,3}$/.test(value);
            },
            message: props => `${props.value} no es valido`
        }
        
    },
    password: {
        type: String,
        required: [true, "El password es necesario"],
    },
   
});
var USER = mongoose.model("user", USERSCHEMA);
module.exports = USER;