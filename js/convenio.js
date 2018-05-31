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
var referencia=database.ref("Universidades");
var prevEvento,prevBotones,max_size,elements_per_page,limit,id,data,sta,dif,prevFiltro;
var convenios={};

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
        
        var prevConvenio='<div class="row" id="'+id[i]+'">';//
        prevConvenio+='';
        prevConvenio+='<div class="col-lg-10 col-lg-offset-1">';//
        prevConvenio+='<div class="panel panel-success">';//
        prevConvenio+='<div class="panel-heading" style="text-align:center" ><h3>'+data[i]['nombre']+'</h3></div>';
        prevConvenio+='<div class="panel-body">';//*
        prevConvenio+='<div class="row" id="wrap">';//**
        
        prevConvenio+='<div class="col-md-9" >';//***
        prevConvenio+='<b align="justify">'+data[i]['descripcion']+'</b>';
        prevConvenio+='<p>Pais: '+data[i]['pais']+'</p>';
        prevConvenio+='<p>Fecha Inicio Convenio: '+data[i]['fechaIni']+'</p>';
        prevConvenio+='<p>Fecha de Terminacion del Convenio: '+data[i]['fechaFin']+'</p>';
        prevConvenio+='</div></div>';
        
        prevConvenio+='<div class="row">';
        prevConvenio+='<div class="col-md-2 col-md-offset-2">';
        prevConvenio+='<button type="button" class="btn btn-warning" onclick="editarEvento(\''+id[i]+'\')">Editar Evento</button>';
        prevConvenio+='</div>';
        prevConvenio+='<div class="col-md-2 col-md-offset-2">';
        prevConvenio+='<button type="button" class="btn btn-danger" onclick="borrarConvenio(\''+id[i]+'\',\''+data[i]['pais']+'\')'+'">Borrar Evento</button>';
        prevConvenio+='</div></div></div></div></div></div>';
        
        $(prevConvenio).appendTo('#listado');
    }
    //dif=max_size-indice;
}

function formulario(){
    
    
    $("#formulario div.row").remove();
    
    prevFiltro='<div style="min-height:100px"></div>';
    prevFiltro+='<div class="panel panel-default">';
    prevFiltro+='<div class="panel-heading">Convenios</div>';
    prevFiltro+='<div class="panel-body">';
    prevFiltro+='<form role="form">';
    prevFiltro+='<div class="form-group">';
    prevFiltro+='<label>Filtrar Convenios Por</label>';
    prevFiltro+='<select class="form-control" id="opcion">';
    prevFiltro+='<option>Todos</option><option>Universidad</option><option>Pais</option>';
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
    location.assign('EditarConvenio.html');
}

function borrarConvenio(id,pais)
{
    
    if (confirm("¿Está seguro/a de que desea eliminar este Convenio ?") == true)
    {
        referencia.child(id).remove();
        
        referencia.orderByChild('nombre').equalTo(pais).on('value', function(snapshot) {
             
            if(snapshot.val() == null){
                                
                database.ref("Paises").orderByChild('nombre').equalTo(pais)
                    .once('value').then(function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                        //remove each child
                        database.ref("Paises").child(childSnapshot.key).remove();
                    });
                });
              // referenciaPais.push(
                // {
                  //  nombre: pais   
                 //   },alFinalizar);                      
            }
        });
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
    
            convenios=datos.val();
            max_size=Object.keys(convenios).length;
            sta = 0;
            elements_per_page = 2;
            limit = elements_per_page;
            data = Object.values(convenios);
            id = Object.keys(convenios);
    
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
            opcion="pais";
            break;
            
        case "Universidad":
             opcion="nombre";
             break;
             
        default:    
        }
        
        referencia.orderByChild(opcion).equalTo(valor).on('value',function(datos)
        {
    
            convenios=datos.val();
            max_size=Object.keys(convenios).length;
            sta = 0;
            elements_per_page = 2;
            limit = elements_per_page;
            data = Object.values(convenios);
            id = Object.keys(convenios);
    
            paginar(sta,limit);
            botones();
     
        },function(objetoError){
            console.log('Error de lectura:'+objetoError.code);
        });
        
        
        
    }
    
    
};

