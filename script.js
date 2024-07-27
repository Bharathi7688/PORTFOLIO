
function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");
 }

 
var header = document.getElementById("nav-items");
var nav = header.getElementsByClassName("act"); 
for (var i = 0; i < nav.length; i++) {
  nav[i].addEventListener("click", function() {
  var current = document.getElementsByClassName("active");
  if (current.length > 0) { 
    current[0].className = current[0].className.replace(" active", "");
  }
  this.className += " active";
  });
}

let btnTop=document.getElementById("btn-top");

window.onscroll=function() {scrollFunction()};

function scrollFunction(){
  if (document.body.scroll>20 || document.documentElement.scrollTop>20)
  {
    btnTop.style.display="block";
  }else {
    btnTop.style.display="none";
  }
}

function topFunction(){
  document.body.scrollTop=0;
  document.documentElement.scrollTop=0;
}
