//
// Slimer :: Phaser.Sprite
//

(function(Slimes) { 
   
  function Slimer(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'slimer');

    this.name = 'simer';

    // repositioning
    this.y = this.y - this.height / 2.0;
 
    // physics
    this.game.physics.p2.enable(this);
    this.body.fixedRotation = true;
    this.body.setMaterialNamed('slimer');

    // physical constants 
    this.athletics = {
      run: {
        force: 20.0,   
      },

      jump: {
        startup:    5,
        endlag:     4,
        force:      170.0,
        shortForce: 120.0
      }
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
  var States = Slimes.States.extend();

  // slimer base state class
  var State = Slimes.State.extend({        

    update: function(force) { 
      this.super(arguments);

      // apply forces from horizontal movement 
      if(this.entity.controls.left.isDown)
        force.x += this.entity.athletics.run.force;
      if(this.entity.controls.right.isDown)
        force.x -= this.entity.athletics.run.force;
    },
    
  });

  //
  // Neutral State
  //

  States.NEUTRAL = State.extend({
     
    update: function(force) {
      this.super(arguments); 

      if(this.entity.controls.jump.isDown)
        this.states.transitionState = this.states.JUMP_START;
    },   

  });
    
  States.JUMP_START = State.extend({

    update: function(force) {
      this.super(arguments);

      // check if jump startup is over
      if(this.frames >= this.entity.athletics.jump.startup) {
        // resolve jump -- if jump was released before startup finished, perform a short jump 
        this.applyJumpForce(force, !this.entity.controls.jump.isDown);
        // transition to the jumping state
        this.states.transitionState = this.states.JUMPING;        
      }
    },

    //
    // Helpers
    //

    applyJumpForce: function(force, isShort) { 
      force.y += this.entity.game.physics.p2.gravity.y;
      force.y += isShort ? this.entity.athletics.jump.shortForce : this.entity.athletics.jump.force;
    },
      
  });  

  States.JUMPING = State.extend({

    reset: function() {
      this.didCollide = false;  
      this.super();  
    },

    update: function(force) {
      this.super(arguments);

      if(this.shouldLand)
        this.states.transitionState = this.states.LANDING;
    },

    collide: function(target) {
      this.super(arguments);
      this.shouldLand = target.sprite.name === 'court';
    },

  });

  States.NO_JUMPS = State.extend({

    update: function(slime, force) {
      this.super(arguments); 
    },
      
  });

  States.LANDING = State.extend({

    update: function (slime, force) {
      this.super(arguments);
      
      if(this.frames >= this.entity.athletics.jump.endlag)
        this.states.transitionState = this.states.NEUTRAL;
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

