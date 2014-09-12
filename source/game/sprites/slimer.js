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

    // setup the slimer's state
    this.states = Slimer.States.init();
    this.state  = this.states.NEUTRAL;  
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
    var force = { x: 0.0, y: 0.0 }; 
    // allow the state to perform custom updating
    this.state.update(this, force);
    // update state if necessary
    this.state.transition(this); 
    // apply force updates
    this.body.applyLinearForce(force.x, force.y);
  }; 
 
  //
  // State Class 
  // 

  var State = {

    // inheritance
    extend: function(attributes) {
      var inheritor = Object.create(this);
      _.extend(inheritor, attributes);
      return inheritor; 
    },
    
    // creation
    init: function() {
      var state = Object.create(this);
      state.reset(); // set any default values
      return state;
    },

    // lifecycle
    reset: function() {
      this.transitionState = null;  
    },

    update: function(slimer, force) { 
      // apply forces from horizontal movement 
      if(slimer.controls.left.isDown)
        force.x += slimer.athletics.runForce;
      if(slimer.controls.right.isDown)
        force.x -= slimer.athletics.runForce;
    },

    transition: function(entity) {
      if(!this.transitionState)
        return; 
      // update the entity's state   
      entity.state = this.transitionState;
      // and then reset this state so that it can be reused 
      this.reset();
    }
    
  };

  Slimer.States = {

    init: function() {
      var states = {};

      for(property in this) {
        // for each of our properties
        var value = this[property];

        // if the value is a state, then we'll create a clone of it
        if(State.isPrototypeOf(value)) {
          var clone        = _.clone(value);
          clone.__proto__  = value.__proto__;
          states[property] = clone;
        }
      }

      return states;
    }
  
  };

  //
  // Neutral State
  //

  Slimer.States.NEUTRAL = State.extend({
     
    update: function(slimer, force) {
      this.__proto__.update.call(this, slimer, force);
      if(slimer.controls.jump.isDown)
        this.transitionState = slimer.states.JUMP_START;
    },   

  });
    
  Slimer.States.JUMP_START = State.extend({

    reset: function() {
      this.__proto__.reset.call(this);
      this.frameCount = 0;  
    },

    update: function(slimer, force) {
      this.__proto__.update.call(this, slimer, force);

      // when jump is no longer held down, transition to jump 
      if(!slimer.controls.jump.isDown) {
        this.transitionState = slimer.states.JUMP;
        // if jump was released quick enough, perform a short jump 
        this.transitionState.isShort = this.frameCount < slimer.athletics.shortJumpFrames;
      }
    },
      
  });  

  Slimer.States.JUMP = State.extend({

    reset: function() {
      this.__proto__.reset.call(this);

      this.isShort      = false;
      this.forceApplied = false;
    },

    update: function(slimer, force) {
      this.__proto__.update.call(this, slimer, force);

      if(!this.forceApplied) 
        this.applyJumpForce(slimer, force); 
    },

    applyJumpForce: function(slimer, force) {
      force.y = this.isShort ? slimer.athletics.shortJumpForce : slimer.athletics.jumpForce;
      this.forceApplied = true;
    },
  
  });

  Slimer.States.NO_JUMPS = State.extend({

    update: function(slime, force) {
      this.__proto__.update.call(this, slime, force);
    },
      
  });

  Slimer.States.LANDING = State.extend({

    update: function (slime, force) {
      this.__proto__.update.call(this, slime, force);
    },
    
  });

  //
  // Utilities
  //

  function resolveJumpForce() {
    // naive: if moving vertically, you can't jump
    if(Math.abs(this.body.velocity.y) > 0.5) 
      return 0.0;
    return this.game.physics.p2.gravity.y + this.athletics.jump;
  }

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

