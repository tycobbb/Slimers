//
// Court :: Phaser.Sprite
//

(function(Slimes) {

  function Court(game, y) {
    Phaser.Sprite.call(this, game, 0, y, 'ground');

    // dimensions
    this.width  = game.world.width;
    this.height = game.world.height - y;

    // physics
    game.physics.enable(this);
    this.body.immovable = true;
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

