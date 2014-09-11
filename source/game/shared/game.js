//
// Game :: Phaser.Game
// 

(function(Slimes) {
  
  // constants
  var width = 300;
  
  // constructor 
  var Game = function() { 
    Phaser.Game.call(this, width, width / 1.6, Phaser.CANVAS, '');
    this.pixel = new Pixel(this);
  }; 
   
  Game.prototype = Object.create(Phaser.Game.prototype);
  Game.prototype.constructor = Game;

  //
  // Pixel Scaling 
  //
 
  var Pixel = function(game) {
    this.game = game; 
    
    // preserve scaling dimensions, fill the window's width
    this.width   = window.innerWidth; 
    this.scale   = this.width / game.width;
    this.height  = game.height * this.scale;
  };

  Pixel.prototype.insertCanvas = function() {
    // hide the existing canvas
    this.game.canvas.style['display'] = 'none';

    // create scaled canvas
    this.canvas  = Phaser.Canvas.create(this.width, this.height);
    this.context = this.canvas.getContext('2d');

    // insert the scaled canvas, disable smoothing
    Phaser.Canvas.addToDOM(this.canvas);
    Phaser.Canvas.setSmoothingEnabled(this.context, false);   
  };

  Pixel.prototype.render = function() {
    // redraw the game's canvas into the scaled context
    this.context.drawImage(this.game.canvas, 
      0, 0, this.game.width, this.game.height, 
      0, 0, this.width,      this.height
    );
  };
   
  //
  // State Lifecycle Hooks 
  //

  Game.prototype.onPreload = function(lambda) {
    if(!this.preloaders)
      this.preloaders = [];
    this.preloaders.push(lambda);
  };

  Game.prototype.runPreloaders = function() {  
    var self = this; 
    var preloaders = self.preloaders;
    if(!preloaders)
      return;

    // call preloader hooks
    preloaders.forEach(function(preloader) {
      preloader(self);
    });

    // destroy hooks after use
    self.preloaders = null; 
  };

  //
  // Namespace Extension
  //  

  Slimes.Game  = Game;
  Slimes.game  = new Game();
  Slimes.start = function() { 
    this.game.state.add('main', Slimes.state, true);
  };

})(window.Slimes = window.Slimes || {});

