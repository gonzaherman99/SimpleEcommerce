function emailc(fid) {
    if (document.getElementById(fid).value = " ") {
        document.getElementById(fid).style.backgroundColor = "red";
    }
}


var first = document.getElementById("inicio");

first.addEventListener("mouseover", function() {
    first.innerHTML = "Yahoo!";
});

first.addEventListener("mouseleave", function() {
    first.innerHTML = "Inicio";
});

alert("Fuck you");