//
// Court :: Phaser.Sprite
//

(function(Slimes) {

  function Court(game, y) {
    Phaser.Sprite.call(this, game, 0.0, y, 'ground');

    this.name = 'court'

    // dimensions
    this.width  = game.world.width;
    this.height = game.world.height - y;
    this.x      = this.x + game.world.width / 2.0;
    this.y      = this.y + this.height / 2.0;

    // physics
    this.game.physics.p2.enable(this);
    this.body.static        = true;
    this.body.fixedRotation = true;
    this.body.setMaterialNamed('court');
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

