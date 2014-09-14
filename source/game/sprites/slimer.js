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
      runForce:  20.0,
      jumpForce: 170.0,
      shortJumpForce:  120.0, 
      shortJumpFrames: 5,
    };

    // setup the slimer's state machine, default to NEUTRAL
    this.states = States.enable(this, 'NEUTRAL');
  };

  Slimer.prototype = Object.create(Phaser.Sprite.prototype);
  Slimer.prototype.constructor = Slimer;

  //
  // Preload Hooks
  //

  Slimes.game.onPreload(function(game) { 
    game.load.spritesheet('slimer', 'assets/slimer.png', 38, 19);
  });

  //
  // Lifecycle
  //

  Slimer.prototype.update = function() {
    this.states.update();
  }; 
 
  //
  // States 
  // 
  
  // create state storage
  var States = Slimes.States.create();

  // slimer base state class
  var State = Slimes.State.extend({        

    update: function(force) { 
      // apply forces from horizontal movement 
      if(this.entity.controls.left.isDown)
        force.x += this.entity.athletics.runForce;
      if(this.entity.controls.right.isDown)
        force.x -= this.entity.athletics.runForce;
    },
    
  });

  //
  // Neutral State
  //

  States.NEUTRAL = State.extend({
     
    update: function(force) {
      this.__proto__.update.apply(this, arguments); 

      if(this.entity.controls.jump.isDown)
        this.states.transitionState = this.states.JUMP_START;
    },   

  });
    
  States.JUMP_START = State.extend({

    reset: function() {
      this.__proto__.reset.call(this);
      this.frames = 0;  
    },

    update: function(force) {
      this.__proto__.update.apply(this, arguments);

      // increment the number of jump frames
      this.frames++;

      // when the user lets go of jump, we're going to transition 
      if(!this.entity.controls.jump.isDown) {
        // resolve jump -- if jump was released quick enough, perform a short jump 
        this.applyJumpForce(force, this.frames < this.entity.athletics.shortJumpFrames); 
        // transition to the jumping state
        this.states.transitionState = this.states.JUMPING;        
     }
    },

    //
    // Helpers
    //

    applyJumpForce: function(force, isShort) { 
      force.y += this.entity.game.physics.p2.gravity.y;
      force.y += isShort ? this.entity.athletics.shortJumpForce : this.entity.athletics.jumpForce;
    },
      
  });  

  States.JUMPING = State.extend({

    update: function(slimer, force) {
      this.__proto__.update.apply(this, arguments);
    }, 
  
  });

  States.NO_JUMPS = State.extend({

    update: function(slime, force) {
      this.__proto__.update.apply(this, arguments); 
    },
      
  });

  States.LANDING = State.extend({

    update: function (slime, force) {
      this.__proto__.update.apply(this, arguments);
    },
    
  });

  //
  // Controls
  //

  Slimer.prototype.registerControls = function(type) {
    this.controls = Slimes.createControls(type);
  };

  //
  // Factory
  //

  Phaser.GameObjectFactory.prototype.slimer = function(x, y, group) {
    if(typeof group === 'undefined')
      group = this.world;  
    return group.add(new Slimer(this.game, x, y));
  };

})(window.Slimes = window.Slimes || { });

