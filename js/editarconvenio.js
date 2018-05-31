
$(document).ready(function()
{
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
    var referenciaBD =database.ref("Universidades");
    var referenciaPais=database.ref("Paises");
    var convenios={};
    

    var convenioId= window.name;
    console.log(convenioId);

    var descripcion, institucion, pais, fechainicial, fechafinal;
    
    
    // revisamos la autenticación antes de acceder al resto de contenido de este fichero.
    firebase.auth().onAuthStateChanged(function(user) {
  if (user)
  {
    console.log(user);
    console.log('Usuario: '+user.uid+' está logueado con '+user.providerData[0].providerId);
    
    //$("#hola").remove();

    var logueado='<a href="login.html" id="botonLogout"><i class="fa fa-table fa-fw"></i> Cerrar Sesion</a>';
   

   $(logueado).appendTo("#cerrarSesion");
   $("#botonLogout").click(desconectar);

} else
{
    console.log('Usuario no logueado');
    location.assign('login.html');
}
});


    function desconectar()
    {
        firebase.auth().signOut().then(function()
        {
           location.assign('login.html');
       }, function(error)
       {
          alert("Error al intentar desconectarse.");
      });
    }

    console.log('convenioid '+convenioId);
    referenciaBD.child(convenioId).once('value',function(datos)
    {
        convenios=datos.val();
        
        descripcion= convenios.descripcion;
        fechainicial=convenios.fechaIni;
        fechafinal=convenios.fechaFin;
        institucion=convenios.nombre;
        
        pais=convenios.pais;
       

        $('#descripcion').val(descripcion);
        $('#fechainicial').val(fechainicial);
        $('#fechafinal').val(fechafinal);
        $('#institucion').val(institucion);
        $('#pais').val(pais);
    
        
    });


    $("#botonActualizar").click(function()
    {
        //subirArchivo(archivo);
        
        descripcion=$('#descripcion').val();
        fechainicial=$('#fechainicial').val();
        fechafinal=$('#fechafinal').val();
        institucion=$('#institucion').val();
        pais=$('#pais').val();
        
        
         referenciaPais.orderByChild('nombre').equalTo(pais).on('value', function(snapshot) {
             
            if(snapshot.val() == null){
               referenciaPais.push(
                 {
                    nombre: pais   
                    },alFinalizar);                      
            }
        });
        
        console.log(fechainicial+' '+fechafinal);
        // Guardamos los datos en referenciaBD
        return referenciaBD.child(convenioId).set(
        {
            descripcion: descripcion,
            fechaIni: fechainicial,
            fechaFin: fechafinal,
            nombre: institucion,
            pais: pais, // imagen: url,
        }, alFinalizar);
    });
    

    function alFinalizar(error)
    {
        if (error)
        {
            alert('Ha habido problemas al realizar la operación: '+error.code);
        }
        else{
            alert('Operación realizada con éxito !');
            location.assign('Convenio.html');
        }
    }
});