var validar = {
    validarPelicula: function(sendDatos, evalueDatos) {
    var msn="";
    
    
    for (var i = 0; i < Object.keys(evalueDatos).length; i++) {
        var cont=0;
        for (var j = 0; j < Object.keys(sendDatos).length; j++) {
            if (Object.keys(sendDatos)[j]==Object.keys(evalueDatos)[i]) {
                cont++;
            }
            if (Object.keys(evalueDatos)[i]=="fechaderegistro") {
                cont++;
            }
            if (Object.keys(evalueDatos)[i]=="Rating") {
                cont++;
            }
            if (Object.keys(evalueDatos)[i]=="fotografia_Portada") {
                cont++;
            }
            if (Object.keys(evalueDatos)[i]=="fotografia_Principal") {
                cont++;
            }
            if (Object.keys(evalueDatos)[i]=="acceso") {
                cont++;
            }
    
        }
        if (cont==0) {
            msn=msn+Object.keys(evalueDatos)[i]+" no existe - ";
        }
    }
    if (msn!="") {
        msn="añadir datos: "+msn;
        return msn;
    }
    
    if (sendDatos.Titulo_de_Pelicula!=""&&sendDatos.Titulo_de_Pelicula!=null) {
        if (sendDatos.Descripcion!=""&&sendDatos.Descripcion!=null) {
            if (sendDatos.Sinopsis!=""&&sendDatos.Sinopsis!=null) {
                if (sendDatos.Idioma!=""&&sendDatos.Idioma!=null) {
                    if (sendDatos["Rating"]=="" ||sendDatos["Rating"]==null){
                        sendDatos["Rating"]=0;
                       // msn=sendDatos["Rating"];
                        //return msn;
                    }
                    /*else{
                        msn="sin datos";
                        return msn;
                    }*/
                    if (parseInt(sendDatos["Rating"])!=""|| parseInt(sendDatos["Rating"])!=null) {
                        
                        if (sendDatos.lista!=""&&sendDatos.lista!=null) {
                            if (sendDatos.fotografia_Portada!=""||sendDatos.fotografia_Portada!=null) {
                                if (sendDatos.fechaderegistro==""||sendDatos.fechaderegistro==null) {
                                    sendDatos["fechaderegistro"] = new Date();
                                }
                                if (sendDatos["acceso"]==""||sendDatos["acceso"]==null) {
                                    var acceso={};
                                    acceso["method"]=["POST","GET","DELETE","PUT","PATCH"]
                                    acceso["services"]=["api/1.0/peliculas","api/1.0/peliculas","api/1.0/peliculas","getfile","api/1.0/peliculas"]
                                    sendDatos["acceso"]=acceso;
                                }else {
                                    msn="no puede añadir los accesos sin administracion";
                                    return msn;
                                }
        
                                if (sendDatos.fechaderegistro!=""&&sendDatos.fechaderegistro!=null) {
                                    if (sendDatos.fotografia_Principal!=""||sendDatos.fotografia_Principal!=null) {
                                        msn="true";
                                        return msn;
                                    } else {
                                        msn="debe añadir la fotografia principal";
                                        return msn;
                                    }
                                } else {
                                    msn="debe añadir la fechaderegistro";
                                    return msn;
                                }
                            } else {
                                msn="debe añadir la foto de portada";
                                return msn;
                            }
                        } else {
                            msn="debe añadir servidores activos ";
                            return msn;
                        }
                    } else {
                        msn="debe añadir el rating ";
                        return msn;
                    }
                } else {
                    msn="debe añadir el idioma";
                    return msn;
                }
            } else {
                msn="debe añadir el sinopsis de la pelicula";
                return msn;
            }
        } else {
            msn="debe añadir la descripcion de la pelicula";
            return msn;
        }
    } else {
        msn="debe añadir el titulo de la pelicula ";
        return msn;
    }
    
    },
};
module.exports = validar;