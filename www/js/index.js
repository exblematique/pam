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
    capteurs = [] ; 
    querySnapshot.forEach(function(doc) {
        capteurs.push(doc.data());
    });
    updateDesign();
    updateGraph();
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
  });

}

function logout(){
  firebase.auth().signOut();
}



function getColor(color){
  var value = "";

   switch (color) {
    case 'green': value = "success"; 
      break;
    case 'lightblue': value = "info";
      break;
    case 'orange': value = "warning"; 
      break;
    case 'red': value = "danger";
      break;
    default:  value = "primary"; // blue par défaut
      break;
  }

  return value;
}

function updateDesign(){

  var HtmlBloc = "";
  var HtmlGraph = "";
  var color = "";
  var countError = 0 ;
  var countColor ="";

  for (var i = 0; i < capteurs.length; i++) {
    // --- Gestion du changement de couleur pour les différents seuil possible.

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

      HtmlBloc  = HtmlBloc + generateSquare(capteurs[i]["name"], capteurs[i]["lastValue"], color) ;
      HtmlGraph = HtmlGraph + createGraph(capteurs[i]["name"]); 
  }

  if(countError>0){ countColor = "danger";  } //green
  else{countColor = "success";}

   var txtProbleme ='<div class="card bg-'+countColor+' text-white shadow">\
                      <div class="card-body">Nombres de problèmes : '+countError+'\
                      </div>\
                    </div>';

  document.querySelector("#nbrProbleme").innerHTML = txtProbleme;
  document.querySelector("#cadreCapteur").innerHTML = HtmlBloc;
  document.querySelector("#generateGraph").innerHTML = HtmlGraph;
}

//Génère le code pour afficher les cadres contenant les valeurs des capteurs.
function generateSquare(name, value, color){

  var border = getColor(color);

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
            </div>\
            \
            ';

  return text; 
}

//Créer le code pour le graphique
function createGraph(name){
  text = '<div class="col-xl-12 col-lg-7">\
              <div class="card shadow mb-4">\
                <!-- Card Header -->\
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">\
                  <h6 class="m-0 font-weight-bold text-primary">'+name+'</h6>\
                </div>\
                <!-- Card Body -->\
                <div class="card-body">\
                  <div class="chart-area">\
                    <canvas id="graph'+name+'"></canvas>\
                  </div>\
                </div>\
              </div>\
            </div>\
            \
            ';

  return text;
}

function updateGraph(){

  var date = [];
  var data = [];
  var shortcurt = "";

   for (var i = 0; i < capteurs.length; i++) {
      shortcurt = capteurs[i]["allValues"];

      for (var n = 0; n <shortcurt.length ; n++ ){
        date.push(shortcurt[n]["date"]);
        data.push(shortcurt[n]["value"]);
      }

     generateGraphData(capteurs[i]["name"],date,data ) ;
     date = [];
     data = [];
   }

}

//Génére le graph en lui même
function generateGraphData(Name,Labels,Data){
  var ctx = document.getElementById("graph"+Name);
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Labels, 
      datasets: [{
        label: "Values",
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: Data,
      }],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: 'Dates'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 7
          }
        }],
        yAxes: [{
          ticks: {
            maxTicksLimit: 5,
            padding: 10
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: 'index',
        caretPadding: 10
      }
    }
  });
}