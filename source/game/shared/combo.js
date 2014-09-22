//
// Combo -- combo.js
//

(function(Slimes) {
  
  var id = 0;

  function Combo(firesOnce) {
    this.id = id++;
    this.sequence = [];
    this.handlers = [];
    this.destroyHandlers = [];
    this.firesOnce = firesOnce;
    this.reset();
  };

  Combo.State = {
    POSSIBLE:   'possible',
    RECOGNIZED: 'recognized',
    FAILED:     'failed'
  };

  //
  // Handlers
  //

  function handlerizer(state) {  
    // return a new function that will type the handler appropriately, and
    // then append it to our list

    return function(handler) {
      handler.state = state  
      this.handlers.push(handler); 
      return this; 
    };
  }

  Combo.prototype.onSuccess = handlerizer(Combo.State.RECOGNIZED);
  Combo.prototype.onFailure = handlerizer(Combo.State.FAILED);

  Combo.prototype.complete = function() {
    var self = this;
    
    logger.debug('COMBO  -- ' + self.id + ' ' + self.state); 

    self.handlers.forEach(function(handler) {
      if(self.state === handler.state)
        handler(self);  
    });
    
    if(self.firesOnce)
      self.destroy();
    else // keep on truckin'
      self.reset();
  };
  
  //
  // Game Loop
  //

  Combo.prototype.reset = function() {
    this.state      = Combo.State.POSSIBLE;
    this.frames     = 0;  
    this.stepFrames = 0;
    this.stepIndex  = 0;
    this.keys       = [];
  };

  Combo.prototype.destroy = function() {
    var self = this;
    
    self.destroyHandlers.forEach(function(handler) {
      handler(self);  
    });

    self.handlers = null;
    self.destroyHandlers = null;
  };

  Combo.prototype.onDestroy = function(handler) {
    this.destroyHandlers.push(handler);
  };

  Combo.prototype.update = function() {
    if(this.sequence.length == 0)
      throw 'ERROR: combos must have at least one step in their sequence'
    
    // increment frame count
    this.frames++;
    this.stepFrames++;

    // call the current step, and update the macro based on the result 
    var result = this.currentStep().run();

    switch(result) {
      case Combo.State.POSSIBLE:
        if(this.stepIndex == 0) this.reset(); break;
      case Combo.State.RECOGNIZED: 
        this.advanceStep(); break; // proceed to the next step
      case Combo.State.FAILED:
        this.state = Combo.State.FAILED; break; // the entire macro fails
    }

    // based on the updates, update our state 
    if(this.stepIndex >= this.sequence.length) // then we've been recognized!
      this.state = Combo.State.RECOGNIZED; 

    // notify our listeners if necessary 
    if(this.state != Combo.State.POSSIBLE)
      this.complete(); 
  };

  Combo.prototype.advanceStep = function() { 
    logger.debug('COMBO  -- ' + this.id + ' completed step: ' + this.stepIndex);

    var step = this.currentStep();
    if(step.pressedKey)
      this.keys.push(step.pressedKey);
    if(step.reset)
      step.reset();

    this.stepIndex++;
    this.stepFrames = 0;

  };

  Combo.prototype.currentStep = function() {
    return this.sequence[this.stepIndex];  
  };

  //
  // Builders
  //

  Combo.prototype.addStep = function(step) {
    if(step.reset)
      step.reset();
    this.sequence.push(step);
    return this;  
  };

  Combo.prototype.press = function(input, frameWindow) {
    var combo = this;
    var keys  = input instanceof Array ? input : [ input ];

    return combo.addStep({

      reset: function() {
        this.pressedKey = null;  
      },

      run: function() {
        if(combo.stepFrames > frameWindow)
          return Combo.State.FAILED;
        else if(!this.pressedKey)
          this.pressedKey = this.findPressedKey();  
        else if(this.pressedKey.isUp)
          return Combo.State.RECOGNIZED;
        return Combo.State.POSSIBLE; 
      },

      // helpers

      // find the first key pressed from our list, if any.
      findPressedKey: function() {
        return keys.reduce(function(memo, key) {
          return key.isDown && key.repeats < combo.stepFrames ? key : memo;
        }, null);   
      },

    }); 
  };

  Combo.prototype.doublePress = function(input, frameWindow) {
    return this.press(input, frameWindow).press(input, frameWindow);
  };

  Combo.prototype.wait = function(frames) {
    var self = this;
     
    return self.addStep({ 
      run: function() {
        if(self.stepFrames >= frames)
          return Combo.State.RECOGNIZED
        return Combo.State.POSSIBLE;
      }
    });
  };

  //
  // Exports
  //

  Slimes.Combo = Combo;

})(window.Slimes = window.Slimes || {});
   
