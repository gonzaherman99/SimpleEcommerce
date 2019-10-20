var name;

function some() {
    var textElement = document.getElementById("text1");
    textElement.className = "fadeOut2";
    function await() {
        textElement.innerHTML = "";
    }
    setTimeout(await, 1000);
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


var button = document.getElementById("18");
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
window.addEventListener("click", function(e){   
  if (button.contains(e.target)){
    // Clicked in box
      console.log("");
  } else if (button2.contains(e.target)) {
      console.log("");
 } else if (button3.contains(e.target)) {
      console.log("");
  } else if (button4.contains(e.target)) {
      console.log("");
  } else if (button5.contains(e.target)) {
      console.log("");
  } else if (button6.contains(e.target)) {
      console.log("");
  } else if (button7.contains(e.target)) {
      console.log("");
  } else if (button8.contains(e.target)) {
      console.log("");
  } else if (button9.contains(e.target)) {
      console.log("");
  }  else if (button10.contains(e.target)) {
      console.log("");
  } else if (button11.contains(e.target)) {
      console.log("");
  }  else {
      some();
      console.log("Clicked outside the box");
  }
});


var button2 = document.getElementById("19");
button2.addEventListener("click", idss);


// BUTTON 13


var button3 = document.getElementById("120");
button3.addEventListener("click", idss);


//BUTTON 14


var button4 = document.getElementById("121");
button4.addEventListener("click", idss);


//BUTTON 15

var button5 = document.getElementById("122");
button5.addEventListener("click", idss);


//BUTTON 16


var button6 = document.getElementById("123");
button6.addEventListener("click", idss);


//BUTTON 17

var button7 = document.getElementById("124");
button7.addEventListener("click", idss);


///BUTTON 18

var button8 = document.getElementById("125");
button8.addEventListener("click", idss);


//BUTTON 19


var button9 = document.getElementById("126");
button9.addEventListener("click", idss);


//BUTTON 20


var button10 = document.getElementById("127");
button10.addEventListener("click", idss);


//BUTTON 21


var button11 = document.getElementById("128");
button11.addEventListener("click", idss);


