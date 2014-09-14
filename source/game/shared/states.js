  
(function(Slimes) {
  
  //
  // States Controller 
  //

  var States = {

    create: function() {
      return Object.create(this); 
    },

    enable: function(entity, defaultStateName) {
      // create a new controller
      var controller = {};
      controller.__proto__ = this.__proto__;
      
      // assosciate the entity with the controller
      // TODO: this probably creates a memory leak (circular reference), so we 
      // should clean up this reference in some kind of onKill/onDestroy handler.
      controller.entity = entity;

      for(property in this) {
        var value = this[property];
        // if the value is a State, then we'll create an instance of it
        if(State.isPrototypeOf(value)) {
          // copy the state
          var state = value.instance(); 
          // associate this collection instance with each state
          // TODO: memory leak (circular reference)?
          state.states = controller;  
          // allow the state to perform initial setup 
          state.reset(entity); 
          
          // set the state on the controller
          controller[property] = state;
          // if we match the default state, then set it immediately 
          if(property == defaultStateName)
            controller.setCurrentState(state);
        }
      }

      return controller;
    },

    update: function() {
      var force = { x: 0.0, y: 0.0 }; 
      // allow the state to perform custom updating
      this.currentState.update(force);
      // update state if necessary
      this.transition(); 
      // apply force updates
      this.entity.body.applyLinearForce(force.x, force.y);
    },

    transition: function() {
      if(!this.transitionState)
        return;
      this.setCurrentState(this.transitionState)
      this.transitionState = null; 
    },

    setCurrentState: function(state) {
      // reset the current state if it exists
      if(this.currentState)
        this.currentState.reset();

      // update the current state, and start it with the current attributes
      this.currentState = state;
      this.currentState.start(this.entity, this.transitionAttributes);
      
      // reset the transition attributes
      this.transitionAttributes = {};
    }
  
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
    
    // create an instance of this state class
    instance: function() {
      // create the clone, setup the prototype chain 
      var instance       = _.clone(this);
      instance.__proto__ = this.__proto__;
      return instance;
    },

    // lifecycle
    start: function(entity, attributes) {
      this.entity = entity;
      _.extend(this, attributes);
    },

    reset: function() {
      this.entity = null; 
    },

    update: function(force) {

    },

  }; 

  //
  // Exports
  //

  Slimes.States = States;
  Slimes.State  = State;

})(window.Slimes = window.Slimes || {});
