//
// Controls -- slimer controls
// controls.js
//

(function(Slimes) {
  
  Slimes.ControlsType = {
    
    PLAYER_ONE: { 
      jump:  Phaser.Keyboard.W,
      fall:  Phaser.Keyboard.S,
      left:  Phaser.Keyboard.A,
      right: Phaser.Keyboard.D
    },

    PLAYER_TWO: {
      jump:  Phaser.Keyboard.I,
      fall:  Phaser.Keyboard.K,
      left:  Phaser.Keyboard.J,
      right: Phaser.Keyboard.L
    }

  };

  Slimes.createControls = function(type) {
    controls = {}; 
    for(control in type)
      controls[control] = this.game.input.keyboard.addKey(type[control]);
    return controls; 
  };
  
})(window.Slimes = window.Slimes || {});

