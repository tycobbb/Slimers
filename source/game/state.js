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
      var court   = this.add.court(this.world.centerY);
      var slimer1 = this.add.slimer(this.world.centerX * 0.5, this.world.centerY); 
      var slimer2 = this.add.slimer(this.world.centerX * 1.5, this.world.centerY);
     
      // register collisions
      this.game.physics.materials('world').contact('slimer');
      this.game.physics.materials('slimer').contact('court');
 
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

