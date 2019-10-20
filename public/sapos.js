var name;

function some() {
    var textElement = document.getElementById("text1");
   if(textElement.className) {
           textElement.className = "";
       }
      textElement.className = "fadeIn2";
      textElement.innerHTML = "";
      textElement.focus(); // use focus trick without setTimeOut
     textElement.className = "fadeOut2";
     textElement.style.color = "white";
}

function something(json) {
       name = json.data.name;
       var textElement = document.getElementById("text1");
       if(textElement.className) {
           textElement.className = "";
       }
      textElement.className = 'fadeOut';
      textElement.innerHTML = "Haz añadido " + name + ", ahora elige tu cantidad.";
      textElement.focus(); // use focus trick without setTimeOut
     textElement.className = 'fadeIn';
     textElement.style.color = "white";
}


//BUTTON 1


var button = document.getElementById("327");
button.addEventListener("click", idss);
function idss() {
    var id = this.id;
    var data = {
    name : id 
    }
 fetch("/clicked", {
     method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    }, 
     body: JSON.stringify(data)
})
   .then(response => response.json() )
   .then(json => (something(json)))  //{
    .catch(err => {
       console.log(err);
    });
}
var form = document.getElementById("btns");
window.addEventListener("click", function(e){   
  if (document.getElementById("327").contains(e.target)){
    // Clicked in box
      console.log("Fuck");
  } else{
      if (form.contains(e.target)) {
          console.log("Fuck");
      } else {
      some();
      console.log("Fuck1");
      }
  }
});
