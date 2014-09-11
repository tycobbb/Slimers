//
// Slimer :: Phaser.Sprite
//

(function(Slimes) {

  function Slimer(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'slimer');
 
    // physics
    this.game.physics.p2.enable(this);
    this.body.fixedRotation = true;
    this.body.setMaterialNamed('slimer');

    // anchoring (after physics) to the bottom of the sprite (might be a bad idea?)
    this.anchor.setTo(0.5, 1.0); 
  };

  Slimer.prototype = Object.create(Phaser.Sprite.prototype);
  Slimer.prototype.constructor = Slimer;

  //
  // Game Loop 
  //

  Slimer.prototype.update = function() {
  
  };

  //
  // Controls
  //

  Slimer.prototype.registerControls = function(type) {
    this.controls = Slimes.createControls(type);
  };

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

