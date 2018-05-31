
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
    var referenciaBD =database.ref("Eventos");
    var referenciaPais=database.ref("Paises");
    var storage = firebase.storage();
    var referenciaST;

    var eventoId= window.name;
    console.log(eventoId);

    var titulo, detalles, horainicial, horafinal,mininicial,minfinal,dia,mes,año,lugar, archivo, url;
    var evento={},paises={};
    
      
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

    // Buscamos el evento
    referenciaBD.child(eventoId).once('value',function(datos)
    {
        evento=datos.val();
        
        titulo= evento.titulo;
        detalles= evento.detalles;
        dia=evento.dia;
        mes=evento.mes;
        año=evento.year;
        horainicial=evento.horaIni;
        mininicial=evento.minIni;
        horafinal=evento.horaFin;
        minfinal=evento.minFin;
        lugar=evento.lugar;
        url=evento.imagen;
        //imagenEdicion=evento.rutafoto;
        
        $('#titulo').val(titulo);
        $('#detalles').val(detalles);
       
        $("#datetimepicker1").data("DateTimePicker").date(dia+'/'+mes+'/'+año);
        
        $("#datetimepicker2").data("DateTimePicker").date(horainicial+':'+mininicial);
        $("#datetimepicker3").data("DateTimePicker").date(horafinal+':'+minfinal);
        //$("#datetimepicker3").data("DateTimePicker").date(fechafinal.toString().substring(0,2)+'/'+fechafinal.toString().substring(2,2)+'/'+fechafinal.toString().substring(4,4));
        
        $('#lugar').val(lugar);
        $('#previsualizacion').attr('src',evento.imagen);
        $('#lista_paises').val(evento.tema);
        
    });

    $("#imagen").change(function(evento){
        
        evento.preventDefault();
        archivo  = evento.target.files[0];
        subirArchivo(archivo);
      });


    $("#botonActualizar").click(function()
    {
        
        
        var titulo=$("#titulo").val();
        var detalles=$("#detalles").val();
        var lugar=$("#lugar").val();
        var fecha=$("#datetimepicker1").find("input").val();
        var horainicial=$("#datetimepicker2").find("input").val();
        var horafinal=$("#datetimepicker3").find("input").val();
        var pais=$('#lista_paises').val();
        
        
        
    
        
       
        // Guardamos los datos en referenciaBD
        return referenciaBD.child(eventoId).set(
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
            lugar: lugar,
            tema: pais,
            imagen:url// imagen: url,
        }, alFinalizar);
    });
    
    // función que se encargará de subir el archivo
    function subirArchivo(archivo) {
      // creo una referencia al lugar donde guardaremos el archivo
      
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