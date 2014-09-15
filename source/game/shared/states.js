  
(function(Slimes) {

  var Base = {

    extend: function(attributes) {
      // create a new object with this as its prototype
      var inheritor = Object.create(this);
      // update the new object with any attributes
      inheritor.merge(attributes);
 
      return inheritor;
    },

    instance: function(attributes, skipClone) {
      // create a new instance that mirroring this one, or an empty object sharing 
      // its prototype if skipClone is true
      var instance = skipClone ? {} : _.clone(this);

      // link the instance's and this object's prototype
      instance.__proto__ = this.__proto__;

      // update the object with any parameterized attribtues
      instance.merge(attributes, true);

      return instance; 
    },

    merge: function(attributes, skipTagging) { 
      if(!skipTagging) {
        var property;

        for(name in attributes) {
          property = attributes[name];

          // for any extended function property, tag it with its name
          if(_.isFunction(property))
            property._name = name;  
        }
      }

      _.extend(this, attributes);
    },

    super: function(args) {
      var proto  = this;

      // extract information about the calling method
      var caller = arguments.callee.caller,
          name   = caller._name;
      
      // track when we find the calling implementation in the prototype chain
      var foundCaller = this[name] === caller,
          superMethod = null;
      
      // traverse the prototype chain
      while(proto = Object.getPrototypeOf(proto)) {
        superMethod = proto[name]; 

        // if this proto has no implementation, check the next link
        if(!superMethod) 
          continue;
        
        // if we find the caller later, mark it
        else if(superMethod === caller) 
          foundCaller = true;
        
        // if we have a super method and found the caller, done 
        else if(foundCaller)
          break;
      }

      if(!foundCaller)
        throw '`super` may not be called outside a method implementation';
      else if(superMethod)
        superMethod.apply(this, args);
    }

  };
  
  //
  // States Controller 
  //

  var States = Base.extend({

    enable: function(entity, defaultStateName) {
      // create a new controller
      var controller = this.instance(null, true);
      
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
  
  });

  //
  // State Class 
  // 

  var State = Base.extend({
    
    // lifecycle
    start: function(entity, attributes) {
      this.entity = entity;
      _.extend(this, attributes);
    },

    reset: function() {
      this.entity = null;
      this.frames = 0;
    },

    update: function(force) {
      this.frames++;
    }

  }); 

  //
  // Exports
  //

  Slimes.Base   = Base;
  Slimes.States = States;
  Slimes.State  = State;

})(window.Slimes = window.Slimes || {});
