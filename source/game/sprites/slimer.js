//
// Slimer :: Phaser.Sprite
//

(function(Slimes) { 
   
  function Slimer(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'slimer');

    this.name = 'slimer';

    // repositioning
    this.y = this.y - this.height / 2.0;
 
    // physics
    this.game.physics.p2.enable(this);
    this.body.fixedRotation = true;
    this.body.setMaterialNamed('slimer');

    // physical constants 
    this.athletics = {
      gravity: 1.0,
      
      run: {
        force: 20.0
      },

      jump: {
        startup:    5,
        endlag:     4,
        force:      170.0,
        shortForce: 120.0
      },

      fastFall: {
        gravity: 3.0,
        initialSpeed: 30.0,
      },

      airDash: { 
        duration: 20,
        force:    200.0,
        initialSpeed: 400.0, 
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

    start: function(slimer) {
      this.super(arguments);
      slimer.body.data.gravityScale = slimer.athletics.gravity; 
    },
     
    update: function(force) {
      this.super(arguments); 

      if(this.entity.controls.jump.isDown)
        this.transition(this.states.JUMP_START);
    }

  });
 
  States.JUMP_START = State.extend({

    update: function(force) {
      this.super(arguments);

      // check if jump startup is over
      if(this.frames >= this.entity.athletics.jump.startup) {
        // resolve jump -- if jump was released before startup finished, perform a short jump 
        this.applyJumpForce(force, !this.entity.controls.jump.isDown);
        // transition to the jumping state
        this.transition(this.states.JUMPING);
      }
    },

    //
    // Helpers

    applyJumpForce: function(force, isShort) { 
      force.y += this.entity.game.physics.p2.gravity.y;
      force.y += isShort ? this.entity.athletics.jump.shortForce : this.entity.athletics.jump.force;

      logger.debug('SLIMER -- applying jump: ' + force.y);
    },
      
  });

  var Airborne = State.extend({
    
    reset: function() {
      this.didCollide = false;
      this.canLand    = true;

      this.super();  
    },

    update: function(force) {
      this.super(arguments);

      if(this.didCollide && this.canLand)
        this.transition(this.states.LANDING);
    },

    collide: function(target) {
      this.super(arguments);
      this.didCollide = target.sprite.name === 'court';
    }

  });

  States.JUMPING = Airborne.extend({

    start: function(slimer) {
      this.super(arguments);
       
      this.addMacro(this.airDash());
      this.addMacro(this.fastFall(slimer.controls.fall));
    },

    //
    // Combos 
    
    airDash: function() {
      var self = this; 

      var controls = self.entity.controls,
          dash = new Slimes.Combo();
     
      // first dash input must be left/right
      dash.press([ 
        controls.left, controls.right 
      ], 14);
      
      // second dash input can be any direction, so there's a total of 8 possiblities
      dash.press([ 
        controls.left, controls.right, 
        controls.jump, controls.fall    
      ], 14);

      dash.onSuccess(function(combo) {
        var firstKey  = combo.keys[0],
            secondKey = combo.keys[1];
        
        // create the direction strucutre; a horizontal direction is garunteed
        var direction = {
          horizontal: firstKey == controls.left ? Direction.LEFT : Direction.RIGHT,
          vertical:   null  
        };   
        
        // only set a vertical direction if the second key was a vertical input 
        if(secondKey == controls.jump)
          direction.vertical = Direction.UP;
        else if(secondKey == controls.fall)
          direction.vertical = Direction.DOWN;
        
        // transition to the dashing state
        self.transition(self.states.AIR_DASHING, { 
          direction: direction
        });
      });

      return dash;
    },

    fastFall: function(key) {
      var self = this;
      
      var fastFall = new Slimes.Combo(true).doublePress(key, 14);
      fastFall.onSuccess(function(macro) {
        // nullify vertical momentum
        self.entity.body.velocity.y = 0.0;
        // increase gravity
        self.entity.body.data.gravityScale = self.entity.athletics.gravity.fast;
      });
      
      return fastFall;
    },

  });

  var Direction = { LEFT: 0, RIGHT: 1, UP: 2, DOWN: 3 };

  States.AIR_DASHING = Airborne.extend({

    start: function() {
      this.super(arguments);
      // check for the collision, but don't transition to landing 
      this.canLand = false;
    },

    reset: function() {
      if(this.entity) // reset the entity's gravity if we have one when air dash ends
        this.entity.body.data.gravityScale = this.entity.athletics.gravity;
      this.super(arguments);  
    },

    firstUpdate: function(force) {
      this.super(arguments); 

      // ignore gravity during air dash
      this.entity.body.data.gravityScale = 0.0; 
      // nullify momentum
      this.entity.body.cancelMomentum(); 
      
      // determine direction vectors for velocity/force 
      var angle = this.angle();
      var impulseSpeed = Phaser.Point.fromAngle(angle - Math.PI);
      var impulseForce = Phaser.Point.fromAngle(angle);
       
      // scale the direction vectors by our speed/force magnitude
      impulseSpeed.scale(this.entity.athletics.airDash.initialSpeed);
      impulseForce.scale(this.entity.athletics.airDash.force);
      
      // update the body 
      this.entity.body.velocity.setPoint(impulseSpeed);
      force.addPoint(impulseForce); 
    },
     
    update: function(force) {
      this.super(arguments);

      if(this.frames >= this.entity.athletics.airDash.duration)
        this.transition(this.didCollide ? this.states.NEUTRAL : this.states.FALLING);  
    },

    //
    // Helpers
    
    angle: function() {
      var isRight = this.direction.horizontal == Direction.RIGHT;
      var angle   = 0.0;

      // if we're going right, add PI (seems backwards) 
      if(isRight)
        angle += Math.PI;
      
      // rotate the air dash based on the second input 
      var rotationScale = isRight ? -1.0 : 1.0;
      var rotation = Math.PI / 8.0 * rotationScale;

      switch(this.direction.vertical) {
        case Direction.UP:
          angle += rotation; break;
        case Direction.DOWN:
          angle -= rotation; break;   
      }

      return angle; 
    },
      
  });

  States.FALLING = Airborne.extend({

  });

  States.LANDING = State.extend({

    update: function (slime, force) {
      this.super(arguments);
      
      if(this.frames >= this.entity.athletics.jump.endlag)
        this.transition(this.states.NEUTRAL);
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

