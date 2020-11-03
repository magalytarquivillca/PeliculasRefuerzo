var mongoose = require("./connect");
var peliculasSchema = new mongoose.Schema({
    Titulo_de_Pelicula : String,
    Descripcion : String,
    Sinopsis : String,
    Idioma : Array,
    Rating : Number,
    fotografia_Portada : {
        relativepath: String,
        pathfile:String   
    },
    fotografia_Principal : {
        relativepath: String,
        pathfile:String   
    },  
    lista : Array,
    fechaderegistro: Date
  
});

var peliculasRef = mongoose.model("peliculasRef", peliculasSchema);
module.exports = peliculasRef;