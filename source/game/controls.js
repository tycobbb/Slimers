//
// Controls -- slimer controls
// controls.js
//

(function(Slimes) {
  
  var ControlsType = {
    
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

  function createControls(type) {
    controls = {}; 
    for(control in type)
      controls[control] = this.game.input.keyboard.addKey(type[control]);
    return controls; 
  };

  
  //
  // Exports
  //

  Slimes.ControlsType   = ControlsType;
  Slimes.createControls = createControls;
 
})(window.Slimes = window.Slimes || {});

