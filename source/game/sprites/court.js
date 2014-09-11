//
// Court :: Phaser.Sprite
//

(function(Slimes) {

  function Court(game, y) {
    Phaser.Sprite.call(this, game, 0.0, y, 'ground');

    // dimensions
    this.width  = game.world.width;
    this.height = game.world.height - y;

    // physics
    this.game.physics.p2.enable(this);
    this.body.static        = true;
    this.body.fixedRotation = true;
    this.body.setMaterialNamed('court');

    // anchoring (after physics)
    this.anchor.setTo(0.0, 0.0);
  };

  Court.prototype = Object.create(Phaser.Sprite.prototype);
  Court.prototype.constructor = Court;

  //
  // Preload Hooks
  //

  Slimes.game.onPreload(function(game) {
    game.load.image('ground', 'assets/ground.png', 1, 1);
  });

  //
  // Factory
  //

  Phaser.GameObjectFactory.prototype.court = function(y, group) {
    if(typeof group === 'undefined')   
      group = this.world;
    return group.add(new Court(this.game, y));
  };
   
})(window.Slimes = window.Slimes || {});

