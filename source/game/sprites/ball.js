//
// Ball -- ball.js
//

(function(Slimes) {
  
  function Ball(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'ball');
    
    this.name = 'ball'
     
    // physics 
    this.game.physics.p2.enable(this);
    this.body.mass = 0.1;
    this.body.setMaterialNamed('ball');
  }

  Ball.prototype = Object.create(Phaser.Sprite.prototype);
  Ball.prototype.constructor = Ball;

  //
  // Preload Hooks
  //

  Slimes.game.onPreload(function(game) {
    game.load.image('ball', 'assets/ball.png', 10, 10);
  });

  //
  // Factory
  //

  Phaser.GameObjectFactory.prototype.ball = function(x, y, group) {
    if(typeof group === 'undefined')
      group = this.world;
    return group.add(new Ball(this.game, x, y));
  };
  
})(window.Slimes = window.Slimes || {});

