//ws = io2;
let socket = io.connect('192.168.2.5:9090');
//this is the same as let socket2 = ws.on("localhost:9000") as we pass the ws to io;
var dead = false; 

function init() {
  // Start drawing
  draw();
  socket.emit('intitialize', {
    playerName: player.name
  })
}

socket.on('countPlayers', (data) =>{ 
  //console.log(data);
  document.querySelector(".playersNum").innerText = "";
  document.querySelector(".playersNum").innerText += "Players in Lobby: "+data;
  document.querySelector(".gamesPlayed");
})

socket.on('intitializeReturn', (data) => {
  stars = data.stars;
  orbs = data.orbs;
  setInterval(() => {
    if(player.xVector) {
      socket.emit('tick', {
        xVector: player.xVector,
        yVector: player.yVector
      });
    }
    // console.log(player);
  }, 33);
});
socket.on('ticktock', (data) => { 
   players = data.players,
  player.locX = data.playerX,
  player.locY = data.playerY
 
});
//console.log(players);
socket.on('orbDeath', (data) => {
  orbs.splice(data.orbIndex,1,data.newOrb);
  //console.log(data);
})

socket.on('updateLeaderboard', (data) => {
  //console.log();
  document.querySelector('.playerTop').innerText="";
  if(data[0]){
  document.querySelector(".playerTop").innerText += "Top Player: "+data[0].name;

  document.querySelector('.highScore').innerHTML="";
  document.querySelector('.highScore').innerText += "High Score: "+data[0].score;
  }
  else {
    document.querySelector('.playerTop').innerText+="";
    document.querySelector(".playerTop").innerText += "Top Player: No Current Player";

    document.querySelector('.highScore').innerText="";
    document.querySelector('.highScore').innerText += "High Score: No Current Player";

  }
  document.querySelector('.leader-board').innerHTML="";

      data.forEach((curPlayer) => {
        document.querySelector('.leader-board').innerHTML +=
        `<li class="leaderboard-player">${curPlayer.name}</li> `
        console.log(player.name);
        console.log(curPlayer.name);
        if(curPlayer.name === player.name){
        document.querySelector('.player-score').innerText=curPlayer.score;  
        }
      }
        )

})

socket.on('playerDeath',(data) => {
    document.querySelector('#game-message').innerHTML = `${data.died.name} absorbed by ${data.killedBy.name} `;
    $("#game-message").css({
      "background-color": "#00e606",
      "opacity" : 1
    });
    $("#game-message").show();
    $("#game-message").fadeOut(5000);
  if(player.name ==data.died.name ){
    $("#game-message").show();
    $("#game-message").fadeOut(5000);
    $('#loginModal').modal('show');
      var newSound=new Audio("../music/gameover.mp3");
      mysound.pause();
      mysound.currentTime = 0;
      newSound.play();
      newSound.addEventListener("ended", function(){
        newSound.currentTime = 0;
        location.reload();
   });

  }
  });
  ;