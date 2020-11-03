var express = require('express');
var router = express.Router();
var USER = require("../database/Peliculas");
var fileUpload = require('express-fileupload');
var sha1 = require('sha1');
//var middleware=require('./middleware');
var validar = require('../utils/validar')

/* GET home page. */

//SERVICIO POST
router.post('/peliculas', async(req, res)  => {
  var params = req.body;
  //params["fechaderegistro"] = new Date();
  if (validar.validarPelicula(params,USER.schema.obj)!="true") {
          res.status(403).json(validar.validarPelicula(params,USER.schema.obj));
          return;
  }
  var peliculasRef = new USER(params);
  var result = await peliculasRef.save();

  res.status(200).json(result);
});

//SERVICIO GET
router.get("/peliculas", (req, res) => {
  var params = req.query;
  console.log(params);
  var limit = 100;
  if (params.limit != null) {
  limit = parseInt(params.limit);
  }
  var order = -1;
  if (params.order != null) {
  if (params.order == "desc") {
  order = -1;
  } else if (params.order == "asc") {
  order = 1;
  }
  }
  var skip = 1;
  if (params.skip != null) {
  skip = parseInt(params.skip);
  }
  USER.find({}).limit(limit).sort({_id: order}).skip(skip).exec((err, docs) => {
  res.status(200).json(docs);
   });
  });

//SERVICIO PATCH
router.patch("/peliculas", (req, res) => {
  if (req.query.id == null) {
  res.status(300).json({msn: "El parámetro ID es necesario"});
  return;
  }
  var id = req.query.id;
  var params = req.body;
  USER.findOneAndUpdate({_id: id}, params, (err, docs) => {
  res.status(200).json(docs);
  });
});


//SERVICIO PUT 

router.use(fileUpload({
  fileSize: 5 * 1024 * 1024
}));
router.put("/updatePortada", (req, res) => {

  var params = req.query;
  var bodydata = req.body;
  if (params.id == null) {
      res.status(300).json({msn: "El parámetro ID es necesario"});
      return;
  }
  var image = req.files.file;
  var path = __dirname.replace(/\/routes/g, "/portada");
  //console.log(path);
  var date = new Date();
  var foto  = sha1(date.toString()).substr(1, 5);
  //console.log(' datos  ');
  //console.log(req.files);
  //console.log(Object.keys(req.files.file));

  var totalpath = path + "/" + foto + "_" + image.name.replace(/\s/g,"_");
  //console.log(totalpath);
  image.mv(totalpath, (err) => {
      if (err) {
          return res.status(300).send({msn : "Error al escribir el archivo en el disco duro"});
      }
      var obj = {};
      obj["pathfile"] = totalpath;
      //obj["hash"] = totalpath;
      obj["relativepath"] = "/getfile/?id=" + totalpath; //obj["hash"];
      //console.log(obj);
      var objhelp={};
      objhelp['fotografia_Portada']=obj;
      USER.update({_id:  params.id}, {$set: objhelp }, (err, docs) => {
  if (err) {
         res.status(500).json({msn: "Existen problemas en la base de datos"});
         return;
      } 
      res.status(200).json(docs);
    });
  });
});

router.put("/updatePrincipal", (req, res) => {
  var params = req.query;
  var bodydata = req.body;
  if (params.id == null) {
      res.status(300).json({msn: "El parámetro ID es necesario"});
      return;
  }

  var image = req.files.file;
  var path = __dirname.replace(/\/routes/g, "/principal");
  console.log(path);
  var date = new Date();
  var foto  = sha1(date.toString()).substr(1, 5);
  var totalpath = path + "/" + foto + "_" + image.name.replace(/\s/g,"_");
  console.log(totalpath);
  image.mv(totalpath, (err) => {
      if (err) {
          return res.status(300).send({msn : "Error al escribir el archivo en el disco duro"});
      }
      var obj = {};
      obj["pathfile"] = totalpath;
      //obj["hash"] = totalpath;
      obj["relativepath"] = "/getfile/?id=" + totalpath; //obj["hash"];
      console.log(obj);
      var objhelp2={};
      objhelp2['fotografia_Principal']=obj;
      USER.update({_id:  params.id}, {$set: objhelp2 }, (err, docs) => {
  if (err) {
         res.status(500).json({msn: "Existen problemas en la base de datos"});
         return;
      } 
      res.status(200).json(docs);
    });
  });
});


router.put("/peliculas", async(req, res) => {
  var params = req.query;
  var datos = req.body;
  if (params.id == null) {
      res.status(300).json({msn: "El parámetro ID es necesario"});
      return;
  }

  var changed = ["Titulo_de_Pelicula", "Idioma"];
  var keys = Object.keys(datos);
  var actualizardato = {};
  for (var i = 0; i < keys.length; i++) {
      if (changed.indexOf(keys[i]) > -1) {
          actualizardato[keys[i]] = datos[keys[i]];
      }
  }
  USER.update({_id:  params.id}, {$set: actualizardato}, (err, docs) => {
     if (err) {y 
         res.status(500).json({msn: "Existen problemas al actualizar en la base de datos"});
          return;
      } 
      res.status(200).json(docs);
  });

});


//SERVICIO DELETE

router.delete("/peliculas", async(req, res) => {
  if (req.query.id == null) {
     res.status(300).json({
    msn:"id no existe"
  });
     return;
  }
  var usuario =  await USER.find({_id: req.query.id});
  if (usuario==0) {
      res.status(500).json({
          msn: "no existe"
      });
      return;
  }
  var r = await USER.remove({_id: req.query.id});
 res.status(300).json(r);
});


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/getfile", async(req, res, next) => {
  var params = req.query;
  if (params.id == null) {
      res.status(300).json({
          msn: "Error es necesario un ID"
      });
      return;
  }
  var id = params.id;
  var usuario =  await USER.find({_id: id});
  //console.log((usuario [0].logo.pathfilel ));
  if (usuario.length > 0) {
      var path = usuario[0].fotografia_Principal.pathfile;
      if (path!=null) {
      res.sendFile(path);
      return;
    }
    else{
      res.status(200).json(usuario[0]);
        return;
    }
  }
  res.status(300).json({
      msn: "Error en la petición"
  });
  return;
});

module.exports = router;
