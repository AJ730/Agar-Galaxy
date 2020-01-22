
class deathStar {
    constructor(settings) {
      this.locX = Math.floor(Math.random() * settings.worldWidth);
      this.locY = Math.floor(Math.random() * settings.worldHeight);
      this.radius = 30;
    }
  }
  
  module.exports = deathStar;