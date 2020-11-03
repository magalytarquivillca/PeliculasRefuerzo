var JWT= require('jsonwebtoken');
var USER=require('../database/Peliculas');

var midleware= async(req,res,next)=>{
	var token= req.headers["authorization"];
	
	if (token==null||token=="") {
		res.status(403).json({error:"no tienes acceso a este lugar token nulo"});
		return;
	}
	try{
	console.log(JWT);
	var decoded=JWT.verify(token,'contraseña');
	if (decoded==null) {
		res.status(403).json({error:"no tienes acceso a este lugar token falso"});
		return;
	}

	
    var iduser=decoded.data;
    console.log(iduser);
	var docs = await USER.findOne({_id: iduser});
	//console.log(docs);
	if (docs==null) {
		res.status(403).json({error:"el usuario no existe en la db"});
		return;
	}
	var roles=docs.acceso;
	var services=req.originalUrl.substr(1,100);
	console.log(services);
	if (services.lastIndexOf("?") > -1) {
		services=services.substring(0,services.lastIndexOf("?"));
	}
	
	var METHOD=req.method;
	var URL= services;
	for (var i = 0; i < roles.method.length; i++) {
		if (METHOD==roles.method[i]&&URL==roles.services[i]) {
			next();
			return;
			
		}
	}
	
	res.status(403).json({error:"no tienes acceso"});
	return;
	
	
	}
	catch(TokenExpiredError){
		res.status(403).json({error:"el tiempo del token ya expiro"});
		return;
	}
}
module.exports = midleware;

