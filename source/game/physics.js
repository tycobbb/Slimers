//
// physics.js
//

(function(Slimes) {

  var Physics = Phaser.Physics,
      P2      = Phaser.Physics.P2,
      Body    = Phaser.Physics.P2.Body;

  //
  // Bootstrapping
  //
   
  Physics.prototype.startWorld = function() {
    this.startSystem(Phaser.Physics.P2JS);
    
    // create the world material
    var material = this.materials('world');

    // set the world's gobal physics properties
    this.p2.gravity.y = 330.0;
    this.p2.setWorldMaterial(material, true, true, true, true);

    return material;
  };

  //
  // Materials
  //

  Physics.prototype.materials = function(name) {
    var material = this.p2.materials[name]; 
    if(!material)
      material = this.p2.createMaterial(name);
    return material; 
  };

  P2.Material.prototype.contact = function(materialName) {
    var options = _options.get(this.name, materialName); 
    if(!options) // ensure we have options registered for this contact material
      return null; 
    
    var physics  = Slimes.game.physics;
    var material = physics.materials(materialName);
    return physics.p2.createContactMaterial(this, material, options);
  };

  Body.prototype.setMaterialNamed = function(name, shape) {
    this.setMaterial(this.game.physics.materials(name), shape);
  };

  //
  // Forces
  //

  Body.prototype.applyLinearForce = function(x, y) {
    this.data.force[0] += x;
    this.data.force[1] += y;    
  };

  Body.prototype.cancelMomentum = function() {
    this.velocity.x = 0.0;
    this.velocity.y = 0.0;  
  };
   
  //
  // Options :: private 
  //
 
  function named(key1, key2) {
    return key1 + '-' + key2; 
  }
  
  var _options = {

    get: function(key1, key2) {
      return this[named(key1, key2)] || this[named(key2, key1)];
    },

    add: function(key1, key2, object) {
      this[named(key1, key2)] = object;
    }

  };

  _options.add('slimer', 'world', {
        
  });

  _options.add('slimer', 'court', {
    restitution: 0.8 
  });

  _options.add('slimer', 'ball', {
  
  });

  _options.add('court', 'ball', {
  
  });
 
})(window.Slimes = window.Slimes || {});

