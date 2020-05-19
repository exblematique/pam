var capteurs = [];
var db = "";
var userUid = "";
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

    

}



function logout(){
  firebase.auth().signOut();
}

