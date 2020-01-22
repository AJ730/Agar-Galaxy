const io = require('../servers.js').io;
const fs = require('fs');
//use event emitter max listener
require('events').EventEmitter.defaultMaxListeners = 100000;

const PlayerCollisions = require('./collisions').checkForPlayerCollisions;
const OrbCollisions = require('./collisions').checkForOrbCollisions;
const StarCollisions = require('./collisions').checkForStarCollision;

const Player = require('./classes/Player');
const PlayerData = require('./classes/PlayerData');
const PlayerConfig = require('./classes/PlayerConfig');
const Orb = require('./classes/Orb');
const deathStar  = require('./classes/deathStar');
let count = 0;
let stars =[];
let orbs = [];
let players = [];
let settings = {
  defaultStars:50,
  defaultOrbs: 5000,
  defaultSpeed: 7,
  defaultSize: 7,
  defaultZoom: 1.5,
  worldWidth: 5000,
  worldHeight: 5000
}

initGame();
setInterval(() => {
  // console.log('tock');
  if(players.length > 0) {
    io.to('game').emit('tock', {
      players
    });
  }
}, 33);

io.sockets.on('connect', (socket) => {

 
  let player = {};
  player.tickSent = false;
  io.sockets.emit('countPlayers', ++count);

  socket.on('disconnect', (data) => {
    io.sockets.emit('countPlayers', --count);
  })
  // a player has connected
 
  socket.on('intitialize', (data) => {
    // add the player to the 'game' namespace
    socket.join('game');
    let playerConfig = new PlayerConfig(settings);
    let playerData = new PlayerData(data.playerName, settings);
    player = new Player(socket.id, playerConfig, playerData);
    setInterval(() => {
      if(player.tickSent) {
        socket.emit('ticktock', {
          players : players, 
          playerX: player.playerData.locX,
          playerY: player.playerData.locY,
        });
        player.tickSent = false;
      }
    }, 33);

    socket.emit('intitializeReturn', {
      stars,
      orbs
      
    });
    players.push(playerData);
  });



socket.on('pressed',()=>{
  //console.log("pressed");
  player.playerConfig.speed= 17;
  if(player.playerData.radius >7){
  player.playerData.radius -= 0.2;
  }
});

socket.on('released',()=>{
  //console.log("released");
  player.playerConfig.speed= 10;
});


   // The client sent over the tick, that means we know what direction to move the socket/player
   socket.on('tick', (data) => {
    player.tickSent = true;

    speed = player.playerConfig.speed;
 
    if (data.xVector && data.yVector) {
      // Update the playerConfig object with the new direction in data
      // and at the same time create a local variable for this callback for readability
      xV = player.playerConfig.xVector = data.xVector;
      yV = player.playerConfig.yVector = data.yVector;

      if((player.playerData.locX < 5 && player.playerData.xVector < 0) || (player.playerData.locX > settings.worldWidth) && (xV > 0)){
          player.playerData.locY -= speed * yV;
      }else if((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > settings.worldHeight) && (yV < 0)){
          player.playerData.locX += speed * xV;
      }else{
          player.playerData.locX += speed * xV;
          player.playerData.locY -= speed * yV;
      }
    }
    let capturedOrb = OrbCollisions(player.playerData,player.playerConfig,orbs,settings);
    capturedOrb.then((data) => {
      const orbData = {
        orbIndex : data,
        newOrb: orbs[data]
      }
       // console.log(orbData);
       io.sockets.emit('updateLeaderboard', getLeaderBoard());
        io.sockets.emit('orbDeath',orbData);  
        //io.sockets.emit('playerScore',player.playerData.score);
   
    }).catch(()=> {
        //console.log("no collision");
    })
    let StarDeath= StarCollisions(player.playerData,player.playerConfig,stars,settings);
    StarDeath.then((data) => {
      players.forEach((currPlayer,i) => {
          if(currPlayer.name == data.died.name){
            players.splice(i);
          }
          
    });
    io.sockets.emit('updateLeaderboard', getLeaderBoard())
    io.sockets.emit('playerDeath', data);
    }).catch((err) => {         
   
    })

      let playerDeath = PlayerCollisions(player.playerData,player.playerConfig,players,player.socketId);
      playerDeath.then((data) => {
            //console.log(data);
            //console.log("player collision");
            io.sockets.emit('updateLeaderboard', getLeaderBoard())
            //io.sockets.emit('playerScore',player.playerData.score);
            io.sockets.emit('playerDeath', data);
      }).catch((err) => {         

      })
      socket.on('disconnect', (data) => {
          players.forEach((currPlayer,i) => {
              if(currPlayer.uid == player.playerData.uid){
                players.splice(i,1);
                count = players.length;
                io.sockets.emit('updateLeaderboard', getLeaderBoard())
              }
          });
      });
  });
});

function getLeaderBoard(){
  players.sort((a,b)=>{
    return b.score - a.score;
});
  let leaderBoard = players.map((curPlayer) => {
    return {
      name : curPlayer.name,
      score : curPlayer.score, 
      id : curPlayer.uid
    }
})   
      return leaderBoard;
}




// Run at the beginning of a new game
function initGame() {
  for(let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }

  for(let i = 0; i < settings.defaultStars; i++) {
    stars.push(new deathStar(settings));
  }
}

module.exports = io;