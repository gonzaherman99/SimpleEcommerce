var password = document.getElementById("password");
var password2 = document.getElementById("password2");

function check() {
    if(password.value === password2.value) {
       console.log("yes");
       } else {
           
           password.style.backgroundColor = "#F32B2B";
           password2.style.backgroundColor = "#F32B2B";
           
            password.addEventListener("blur", function() {
                password.style.backgroundColor = "#F32B2B";
            });
            password2.addEventListener("blur", function() {
                password2.style.backgroundColor = "#F32B2B";
            });
           
           document.getElementById("warning").innerHTML = "Los contraseñas no concuerdan";
            
           password.addEventListener("focus", function() {
               password.style.backgroundColor = "white";
           });
           password2.addEventListener("focus", function() {
               password2.style.backgroundColor = "white";
           });       
           
           if (password.value === password2.value) {
                res.redirect("/regis/registrate.html");
           }
       }
   
}

