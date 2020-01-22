//let wHeight = $(window).height();
//let wWidth = $(window).width();
let player = {}; // This is all things "this" player
let orbs = [];
let stars = [];
let players = [];
var mysound=new Audio("../music/Agario.mp3");
let canvas = document.querySelector('#the-canvas');
let context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

$(window).load(() => {
  $('#loginModal').modal('show');
});

$('.name-form').submit((event) => {
  event.preventDefault();
  player.name = document.querySelector('#name-input').value;
  document.cookie = "username="+player.name;

  $('#loginModal').modal('hide');
  $('#spawnModal').modal('show');
  
  mysound.loop=true;
  mysound.autoplay = true;
  mysound.play();
  
  document.querySelector('.player-name').innerHTML = player.name;
});

$('.start-game').click(() => {
  $('.modal').modal('hide');
  $('.hiddenOnStart').removeAttr('hidden');
  init();
});

document.body.onkeydown = function(e){
  if(e.keyCode == 32){
      //your code
      socket.emit("pressed", "pressed");
      
  }


}

document.body.onkeyup = function(e){
  if(e.keyCode == 32){
      //your code
      socket.emit("released", "released");
      
  }
 
  function fullscreen(){
             var el= document.querySelector('#GameContainer');
   
             if(el.webkitRequestFullScreen) {
                 el.webkitRequestFullScreen();
             }
            else {
               el.mozRequestFullScreen();
            }            
  }
   
  canvas.addEventListener("click",fullscreen)


}
