//
// State -- main game state
// state.js
//

(function(Slimes) {
 
  Slimes.state = {

    //
    // State Lifecycle
    //
  
    init: function() {
      this.game.pixel.insertCanvas();
    },
    
    preload: function() {  
      this.game.runPreloaders();
    },

    create: function() { 
      // create the world
      var world = this.game.physics.startWorld();
      
      // create the game objects 
      var court   = this.add.court(this.world.height - 55.0);
      var slimer1 = this.add.slimer(this.world.centerX * 0.5, court.y); 
      var slimer2 = this.add.slimer(this.world.centerX * 1.5, court.y);
      var ball    = this.add.ball(slimer1.x, slimer1.y - 45.0);
     
      // register collisions
      this.game.physics.materials('world').contact('slimer');
      this.game.physics.materials('slimer').contact('court');
      this.game.physics.materials('slimer').contact('ball');
      this.game.physics.materials('court').contact('ball');
 
      // add controls
      slimer1.registerControls(Slimes.ControlsType.PLAYER_ONE);
      slimer2.registerControls(Slimes.ControlsType.PLAYER_TWO);  
    },
   
    update: function() {
    
    },

    render: function() {
      this.game.pixel.render();
    },

  };
  
})(window.Slimes = window.Slimes || {});

