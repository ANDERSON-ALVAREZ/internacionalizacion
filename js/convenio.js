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
var prevEvento,prevBotones,max_size,elements_per_page,limit,id,data,sta,dif;
var convenios={};

// Chequeamos la autenticación antes de acceder al resto de contenido de este fichero.
 firebase.auth().onAuthStateChanged(function(user) {
  if (user)
  {
    console.log(user);
    console.log('Usuario: '+user.uid+' está logueado con '+user.providerData[0].providerId);
  

    var logueado='<a href="login.html" id="botonLogout"><i class="fa fa-table fa-fw"></i> Cerrar Sesion</a>';
   
    

   $(logueado).appendTo("#cerrarSesion");
   $("#botonLogout").click(desconectar);
   //$("#botonLogout").click(desconectar);

referencia.on('value',function(datos)
{
    
    convenios=datos.val();

//botones(3);
   max_size=Object.keys(convenios).length;
   
   sta = 0;
   elements_per_page = 2;
   limit = elements_per_page;
   data = Object.values(convenios);
      
       
    id = Object.keys(convenios);
    
    paginar(sta,limit);
     
     
    

},function(objetoError){
    console.log('Error de lectura:'+objetoError.code);
});

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

