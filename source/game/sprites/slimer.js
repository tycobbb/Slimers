//
// Slimer :: Phaser.Sprite
//

(function(Slimes) { 
   
  function Slimer(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'slimer');

    // repositioning
    this.y = this.y - this.height / 2.0;
 
    // physics
    this.game.physics.p2.enable(this);
    this.body.fixedRotation = true;
    this.body.setMaterialNamed('slimer');

    // physical constants 
    this.athletics = {
      horizontal: 20.0,
      vertical:   50.0, 
    };
  };

  Slimer.prototype = Object.create(Phaser.Sprite.prototype);
  Slimer.prototype.constructor = Slimer;

  //
  // Lifecycle
  //

  Slimer.prototype.update = function() {
    var x = 0.0, y = 0.0;
   
    // accumulate force updates from all possible inputs 
    if(this.controls.left.isDown)
      x += this.athletics.horizontal;
    if(this.controls.right.isDown)
      x -= this.athletics.horizontal;
    if(this.controls.jump.isDown)
      y += resolveJumpForce.call(this); 

    // apply force updates
    this.body.applyLinearForce(x, y);
  };

  function resolveJumpForce() {
    // naive: if moving vertically, you can't jump
    if(Math.abs(this.body.velocity.y) > 0.5) 
      return 0.0;
    return -this.game.physics.p2.gravity.y - this.athletics.vertical;
  }

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
  };

})(window.Slimes = window.Slimes || { });

