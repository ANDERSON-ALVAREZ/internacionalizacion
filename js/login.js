

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

function exito()
{
    $("#spinner").html("");
    console.log("hola");
    location.assign('Admin.html');
}

$(function()
{
    $("#botonLogin").click(function()
    {
        
        var email=$("#email").val();
        var password=$("#password").val();

        firebase.auth().signInWithEmailAndPassword(email, password).then(exito).catch(function(error)
        {
            $("#spinner").html("");
            //console.log(error);
            alert ("Error detectado:\n\n"+error.message);
        });
   
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

});