/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// Inicializar la base de datos
var config = {
    apiKey: "AIzaSyBs8iUAqxwG8ipgfi-GeJx_lhYeKzQHrok",
    authDomain: "internacionalizacion-dd726.firebaseapp.com",
    databaseURL: "https://internacionalizacion-dd726.firebaseio.com",
    projectId: "internacionalizacion-dd726",
    storageBucket: "internacionalizacion-dd726.appspot.com",
    messagingSenderId: "299178322835"
  };

firebase.initializeApp(config);
var database = firebase.database();
var referencia=database.ref("Eventos");
var prevEvento,prevBotones,max_size,elements_per_page,limit,id,data,sta,dif,prevFiltro;
var eventos={};

// Chequeamos la autenticación antes de acceder al resto de contenido de este fichero.
 firebase.auth().onAuthStateChanged(function(user) {
  if (user)
  {
    
  

    var logueado='<a href="login.html" id="botonLogout"><i class="fa fa-table fa-fw"></i> Cerrar Sesion</a>';
   
   $(logueado).appendTo("#cerrarSesion");
   $("#botonLogout").click(desconectar);
   
   
   formulario();

} else
{
    console.log('Usuario no logueado');
    location.assign('login.html');
}
});

function desconectar()
{
    firebase.auth().signOut().then(function() {
       location.assign('login.html');
   }, function(error)
   {
      alert("Error al intentar desconectarse.");
  });

}


function paginar(sta,limit) {
    
    
    // Eliminamos el contenido del listado para actualizarlo.
    $("#listado div.row").remove();
    
    
    for (var i =sta ; i < limit; i++) {
        
        //alert(i);
        prevEvento='<div class="row" id="'+id[i]+'">';//
        prevEvento+='';
        prevEvento+='<div class="col-lg-12">';//
        prevEvento+='<div class="panel panel-primary">';//
        prevEvento+='<div class="panel-heading" style="text-align:center" ><h3>'+data[i]['titulo']+'</h3></div>';
        prevEvento+='<div class="panel-body">';//*
        prevEvento+='<div class="row" style="background-color:#FFFFFF;">';//**
        prevEvento+='<div class="col-md-4" style="min-height:140px"><center>';
        
         if (data[i]['imagen']=='NONE')
            prevEvento+='<img alt="Sin Fotografía"/>';
        else
            prevEvento+='<img src="'+data[i]['imagen']+'"  width="140" height="140" id="wrap"/>';
        prevEvento+='</center></div>';
        
        prevEvento+='<div class="col-md-7 col-md-offset-1 imagenFix"" >';//***
        prevEvento+='<b>'+data[i]['detalles']+'</b>';
        prevEvento+='<br>Lugar:  '+data[i]['lugar']+'</br>';
        prevEvento+='<br>Fecha:  '+data[i]['dia']+'/'+data[i]['mes']+'/'+data[i]['year']+'</br>';
        prevEvento+='<br>Hora Inicial: '+data[i]['horaIni']+':'+data[i]['minIni']+'  Hora Final: '+data[i]['horaFin']+':'+data[i]['minFin']+'</br>';
        prevEvento+='</div></div>';
        
        prevEvento+='<div style="min-height:30px"></div>';
        prevEvento+='<div class="row" >';
        prevEvento+='<div class="col-md-2 col-md-offset-2" ">';
        prevEvento+='<button type="button" class="btn btn-warning" onclick="editarEvento(\''+id[i]+'\')">Editar Evento</button>';
        prevEvento+='</div>';
        prevEvento+='<div class="col-md-2 col-md-offset-2">';
        prevEvento+='<button type="button" class="btn btn-danger" onclick="borrarEvento(\''+id[i]+'\')">Borrar Evento</button>';
        prevEvento+='</div></div></div></div></div></div>';
        
   
        
        $(prevEvento).appendTo('#listado');
        //alert('suma indice'+indice);
        //indice++;
       
    }
    //dif=max_size-indice;
}

function formulario(){
    
    
    $("#formulario div.row").remove();
    
    prevFiltro='<div style="min-height:100px"></div>';
    prevFiltro+='<div class="panel panel-default">';
    prevFiltro+='<div class="panel-heading">Eventos/div>';
    prevFiltro+='<div class="panel-body">';
    prevFiltro+='<form role="form">';
    prevFiltro+='<div class="form-group">';
    prevFiltro+='<label>Filtrar Eventos Por</label>';
    prevFiltro+='<select class="form-control" id="opcion">';
    prevFiltro+='<option>Todos</option><option>Pais</option><option>Lugar</option><option>Año</option>';
    prevFiltro+='</select></div>';
    prevFiltro+='<div class="form-group">';
    prevFiltro+='<input class="form-control" id="valor"></div>';
    prevFiltro+='<div class="form-group">';
    prevFiltro+='<button type="button" class="col-lg-offset-5 btn btn-primary" onclick="Filtrar()">Filtrar</button>';
    prevFiltro+='</div></form></div></div>';
    
    $(prevFiltro).appendTo('#formulario');
}

function nextvalue(){
        
        var next = limit;
	if(max_size>=next) {
	limit = limit+elements_per_page;
	
	paginar(next,limit);
	}
  };
  
function prevalue(){
    
    
	var pre = limit-(2*elements_per_page);
	if(pre>=0) {
	limit = limit-elements_per_page;
	
	paginar(pre,limit); 
	}
  };
  

function botones() {
    
   
    $("#botones div.row").remove();
    
   
     prevBotones='<button type="button" class=" col-md-2 col-md-offset-5 btn btn-primary btn-circle" onclick="prevalue()"><</button>';
     prevBotones+='<button type="button" class=" col-md-2 col-md-offset-1 btn btn-primary btn-circle" onclick="nextvalue()">></button>';
     
    $(prevBotones).appendTo('#botones');
}


function editarEvento(id)
{
    // Para pasar el ID a otro proceso lo hacemos a través de window.name
    window.name= id;

    // Cargamos la página EditarEvento.html
    location.assign('EditarEvento.html');
}

function borrarEvento(id)
{
    if (confirm("¿Está seguro/a de que desea eliminar este evento ?") == true)
    {
        referencia.child(id).remove();
    }
}

function Filtrar(){
    
    
    var opcion=$("#opcion").val();
    var valor=$("#valor").val();
    
    //console.log(opcion,'-',valor);
    
    if(opcion == "Todos"){
        
       $("#formulario").empty();
        
       referencia.on('value',function(datos)
        {
    
            eventos=datos.val();
            max_size=Object.keys(eventos).length;
            sta = 0;
            elements_per_page = 2;
            limit = elements_per_page;
            data = Object.values(eventos);
            id = Object.keys(eventos);
    
            paginar(sta,limit);
            botones();
     
        },function(objetoError){
            console.log('Error de lectura:'+objetoError.code);
        });
        
    }else if(opcion != "Todos" && valor==""){
        
        alert("Debe Ingresar un valor valido");
        
    }else{
        
        $("#formulario").empty();
        
        switch(opcion){
            
        case "Pais":
            opcion="tema";
            break;
            
        case "Lugar":
             opcion="lugar";
             break;
             
        case "Año":
             opcion="year";
             break;
         
        default:    
        }
        
        referencia.orderByChild(opcion).equalTo(valor).on('value',function(datos)
        {
    
            eventos=datos.val();
            max_size=Object.keys(eventos).length;
            sta = 0;
            elements_per_page = 2;
            limit = elements_per_page;
            data = Object.values(eventos);
            id = Object.keys(eventos);
    
            paginar(sta,limit);
            botones();
     
        },function(objetoError){
            console.log('Error de lectura:'+objetoError.code);
        });
        
        
        
    }
    
    
};

