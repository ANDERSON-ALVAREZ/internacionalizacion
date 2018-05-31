
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
    var referenciaPais=database.ref("Paises");
    var storage = firebase.storage();
    

    var titulo, detalles,fecha, horainicial, horafinal,lugar, url,pais;
    var paises={};
    

    
    $("#datetimepicker1").datetimepicker({
        format: 'DD/MM/YYYY'});

    $("#datetimepicker2").datetimepicker({
        format: 'HH:mm'});
      
    $("#datetimepicker3").datetimepicker({
        format: 'HH:mm'});    
      

    // revisamos la autenticación antes de acceder al resto de contenido de este fichero.
    firebase.auth().onAuthStateChanged(function(user) {
  if (user)
  {
    console.log(user);
    console.log('Usuario: '+user.uid+' está logueado con '+user.providerData[0].providerId);
  

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
    
    
    referenciaPais.on('value',function(datos)
    {
    // Eliminamos el contenido del listado para actualizarlo.
        //$("#listado div.row").remove();

        paises=datos.val();

        // Recorremos los paises y los mostramos
        $.each(paises, function(indice,valor)
        {
            console.log(indice);
            $('#lista_paises').append(new Option(valor.nombre));
            
        });
    

    },function(objetoError){
        console.log('Error de lectura:'+objetoError.code);
    });
    
    

    
     $("#imagen").change(function(evento){
        
        evento.preventDefault();
        archivo  = evento.target.files[0];
        subirArchivo(archivo);
      });
    

    $("#formularioAlta").change(function()
    {
        titulo=$("#titulo").val();
        detalles=$("#detalles").val();
        lugar=$("#lugar").val();
        fecha=$("#datetimepicker1").find("input").val();
        horainicial=$("#datetimepicker2").find("input").val();
        horafinal=$("#datetimepicker3").find("input").val();

        if (titulo && detalles )
        {
            $("#botonGuardar").prop("disabled",false);
        }
        else
        {
            $("#botonGuardar").prop("disabled",true);
        }

    });


    $("#botonGuardar").click(function()
    {
        //subirArchivo(archivo);
        
        var titulo=$("#titulo").val();
        var detalles=$("#detalles").val();
        var lugar=$("#lugar").val();
        fecha=$("#datetimepicker1").find("input").val();
        horainicial=$("#datetimepicker2").find("input").val();
        horafinal=$("#datetimepicker3").find("input").val();
        var pais = $('#lista_paises').val();
        
        
       if (!url)
        {
            url="NONE";
        }
        
        
        var referencia=database.ref("Eventos");
        

        // Guardamos los datos en referenciaBD
        referencia.push(
        {
            titulo: titulo,
            detalles: detalles,
            dia: fecha.toString().substring(0,2),
            mes: fecha.toString().substring(3,5),
            year: fecha.toString().substring(6,10),
            horaIni: horainicial.toString().substring(0,2),
            minIni: horainicial.toString().substring(3,5),
            horaFin: horafinal.toString().substring(0,2),
            minFin: horafinal.toString().substring(3,5),
            tema: pais,
            lugar: lugar, // imagen: url,
            imagen: url
        }, alFinalizar);
    });
    
    // función que se encargará de subir el archivo
    function subirArchivo(archivo) {
      // creo una referencia al lugar donde guardaremos el archivo
      var referenciaST = storage.ref('Imagenes').child(archivo.name);
      // Comienzo la tarea de upload
      uploadTask = referenciaST.put(archivo);

      // defino un evento para saber qué pasa con ese upload iniciado
      uploadTask.on('state_changed', null,
        function(error){
          console.log('Error al subir el archivo', error);
        },
        function(){
            
            referenciaST.getDownloadURL().then(function(url) {
  console.log(url);
});
 
        }
      );
    }

// función que se encargará de subir el archivo
    function subirArchivo(archivo) {
      // creo una referencia al lugar donde guardaremos el archivo
      alert('Operación realizada con éxito !');
      referenciaST = storage.ref('Imagenes').child(archivo.name);
      // Comienzo la tarea de upload
      uploadTask = referenciaST.put(archivo);

      // defino un evento para saber qué pasa con ese upload iniciado
      uploadTask.on('state_changed', null,
        function(error){
          console.log('Error al subir el archivo', error);
        },
        function(){
            
            url = uploadTask.snapshot.downloadURL;
 
        }
      );
    }
    
    function alFinalizar(error)
    {
        if (error)
        {
            alert('Ha habido problemas al realizar la operación: '+error.code);
        }
        else{
            alert('Operación realizada con éxito !');
            location.assign('Admin.html');
        }
    }
});