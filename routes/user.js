var express = require("express");
var sha1 = require("sha1");
var router = express.Router();
var USER = require("../database/user");
var JWT = require("jsonwebtoken");
router.get("/user",  (req, res, ) => {
    var filter = {};
    var params = req.query;
    var select = "";
    var aux = {};
    var order = {};
    if (params.nick != null) {
        var expresion = new RegExp(params.nick);
        filter["nick"] = expresion;
    }
    if (params.filters != null) {
        select = params.filters.replace(/,/g, " ");
    }
    if (params.agegt != null) {
        var gt = parseInt(params.agegt);
        aux["$gt"] =  gt;
    }
    if (params.agelt != null) {
        var gl = parseInt(params.agelt);
        aux["$lt"] =  gl;
    }
    if (params.order != null) {
        var data = params.order.split(",");
        var number = parseInt(data[1]);
        order[data[0]] = number;
    }
    USER.find(filter).
    select(select).
    sort(order).
    exec((err, docs) => {
        if (err) {
            res.status(500).json({msn: "Error en el servidor"});
            return;
        }
        res.status(200).json(docs);
        return;
    });
});
router.post("/user",  (req, res) => {
    var userRest = req.body;
    //creamos validacion para el password
    if (userRest.password == null) {
        res.status(300).json({msn: "El password es necesario pra continuar con el registro"});
        return;
    }
    if (userRest.password.length < 6) {
        res.status(300).json({msn: "Es demasiado corto"});
        return;
    }
    if (!/[A-Z]+/.test(userRest.password)) {
        res.status(300).json({msn: "El password necesita una letra Mayuscula"});
        
        return;
    }
    if (!/[\$\^\@\&\(\)\{\}\#]+/.test(userRest.password)) {
        res.status(300).json({msn: "Necesita un caracter especial"});
        return;
    }
    userRest.password = sha1(userRest.password);
    var userDB = new USER(userRest);
    userDB.save((err, docs) => {
        if (err) {
            var errors = err.errors;
            var keys = Object.keys(errors);
            var msn = {};
            for (var i = 0; i < keys.length; i++) {
                msn[keys[i]] = errors[keys[i]].message;
            }
            res.status(500).json(msn);
            return;
        }
        res.status(200).json(docs);
        return;
    })
});
router.put("/user",  async(req, res) => {
    var params = req.query;
    var bodydata = req.body;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    var allowkeylist = ["nick", "email"];
    var keys = Object.keys(bodydata);
    var updateobjectdata = {};
    for (var i = 0; i < keys.length; i++) {
        if (allowkeylist.indexOf(keys[i]) > -1) {
            updateobjectdata[keys[i]] = bodydata[keys[i]];
        }
    }
    USER.update({_id:  params.id}, {$set: updateobjectdata}, (err, docs) => {
       if (err) {
           res.status(500).json({msn: "Existen problemas en la base de datos"});
            return;
        } 
        
    });

});
router.delete("/user",(req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    USER.remove({_id: params.id}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "Existen problemas en la base de datos"});
             return;
         } 
         res.status(200).json(docs);
    });
});

router.post("/login", async(req, res) => {
    var body = req.body;
    if (body.email == null) {
        res.status(300).json({msn: "El email es necesario"});
             return;
    }
    if (body.password == null) {
        res.status(300).json({msn: "El password es necesario"});
        return;
    }
    var results = await USER.find({email: body.email, password: sha1(body.password)});
   if (results.length == 1) {
        var token = JWT.sign({
            exp: Math.floor(Date.now() / 1000) + (60*60),
            data: results[0].id
        },'Magaly');
        res.status(200).json({msn: "Bienvenido " + body.email + " al sistema", token : token});
        return;
        }
    res.status(200).json({msn: "incorrectas"});
});
module.exports = router;