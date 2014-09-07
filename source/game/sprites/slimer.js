//
// Slimer :: Phaser.Sprite
//

(function(Slimes) {

  function Slimer(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'slimer');

    // anchor to the bottom of the sprite (might be a bad idea?)
    this.anchor.setTo(0.5, 1.0);
  
    // physics
    game.physics.enable(this);
    this.body.bounce.y  = 0.2;
    this.body.gravity.y = 300;
    this.body.collideWorldBounds = true;
  };

  Slimer.prototype = Object.create(Phaser.Sprite.prototype);
  Slimer.prototype.constructor = Slimer;

  //
  // Preload Hooks
  //

  Slimes.game.onPreload(function(game) { 
    game.load.spritesheet('slimer', 'assets/slimer.png', 70, 35);
  });

  //
  // Factory
  //

  Phaser.GameObjectFactory.prototype.slimer = function(x, y, group) {
    if(typeof group === 'undefined')
      group = this.world;  
    return group.add(new Slimer(this.game, x, y));
  }

})(window.Slimes = window.Slimes || { });

