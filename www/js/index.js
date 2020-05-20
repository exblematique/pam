var capteurs = [];
var db       = "";
var userUid  = "";
var userInfo = {};


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    document.getElementById("wrapper").style.display = "flex";
    document.getElementById("login_div").style.display = "none";

    user = firebase.auth().currentUser;
    
    init();

  } else {
    // No user is signed in.
    document.getElementById("wrapper").style.display = "none";
    document.getElementById("login_div").style.display = "block";

    capteurs = [];
    db = "";
    userUid = "";
  }
});


function init(){
  db = firebase.firestore();
  userUid = firebase.auth().currentUser.uid;

 // Récupère le nom et le prénom de l'utilisateur
  db.collection("Users").doc(userUid).get()
  .then(function (doc) {
      userInfo = doc.data();
      document.querySelector("#nameSurname").innerText = userInfo["firstName"] +" "+  userInfo["lastName"];
  });

  //A chaque modif de la BD
  //Récup les valeurs et met a jour les datas.

  db.collection("Users").doc(userUid).collection("data")
  .onSnapshot(function(querySnapshot) {
    capteurs = []
    querySnapshot.forEach(function(doc) {
        capteurs.push(doc.data());
    });
    updateDesign()
  });

}


function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

}

function updateDesign(){

  var txtHtml = "";
  var color = "";
  var countError = 0 ;
  var countColor ="";

  for (var i = 0; i < capteurs.length; i++) {

      //Seuil low non définit
      if (capteurs[i]["lowThreshold"] == undefined){
        //Seuil low + hight non définit
        if (capteurs[i]["highThreshold"] == undefined){
          color = "blue";
        }else{
        //Seuil low non définit + capteur Hight définit
          if(capteurs[i]["lastValue"] < capteurs[i]["highThreshold"]){  
            color = "green";
          }else{
            color = "red";
            countError ++;
          }
        }
      }else{
        //Seuil low définit + hight non définit
        if (capteurs[i]["highThreshold"] == undefined){
          if(capteurs[i]["lastValue"] < capteurs[i]["lowThreshold"]){  
            color = "green";
          }else{
            color = "red";
            countError ++;
          }
        //Seuil low définit + hight défnit
        }else{
          if(capteurs[i]["lastValue"] < capteurs[i]["highThreshold"] && capteurs[i]["lastValue"] > capteurs[i]["lowThreshold"]) 
          { 
           color = "green";
          }else{
           color = "red";
           countError ++;
          }
        }
      } 

      txtHtml = txtHtml + generateSquare(capteurs[i]["name"], capteurs[i]["lastValue"], color) ; 
  }

  document.querySelector("#cadreCapteur").innerHTML = txtHtml;

  if(countError>0){ countColor = "danger";  } //green
  else{countColor = "success"}

   var txtProbleme ='<div class="card bg-'+countColor+' text-white shadow">\
                      <div class="card-body">Nombres de problèmes : '+countError+'\
                      </div>\
                    </div>';

  document.querySelector("#nbrProbleme").innerHTML = txtProbleme;
}

//Génère le code pour afficher les cadres contenant les valeurs des capteurs.
function generateSquare(name, value, color){

  var border = "" ; 
  // Différente couleur
  switch (color) {
    case 'green': border = "success"; 
      break;
    case 'lightblue': border = "info";
      break;
    case 'orange': border = "warning"; 
      break;
    case 'red': border = "danger";
      break;
    default:  border = "primary"; // blue par défaut
      break;
  }

  text = '<div class="col-xl-3 col-md-6 mb-4">\
              <div class="card border-left-'+border+' shadow h-100 py-2">\
                <div class="card-body">\
                  <div class="row no-gutters align-items-center">\
                    <div class="col mr-2">\
                      <div class="text-xs font-weight-bold text-'+border+' text-uppercase mb-1">'+name+'</div>\
                      <div class="h5 mb-0 font-weight-bold text-gray-800">'+value+'</div>\
                    </div>\
                  </div>\
                </div>\
              </div>\
            </div>';

  return text; 
}

function getSeuil(){

}



function logout(){
  firebase.auth().signOut();
}

