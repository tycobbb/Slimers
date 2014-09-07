//
// State -- main game state
//

(function(Slimes) {
 
  Slimes.state = {

    //
    // State Lifecycle
    //
  
    init: function() {
      this.game.pixel.insertCanvas();
    },
    
    preload: function() {  
      this.game.runPreloaders();
    },

    create: function() { 
      this.physics.startSystem(Phaser.Physics.ARCADE);
  
      var court   = this.add.court(this.world.centerY);
      var slimer1 = this.add.slimer(this.world.centerX * 0.5, this.world.centerY);
      var slimer2 = this.add.slimer(this.world.centerX * 1.5, this.world.centerY);

      this.addCollider(court, slimer1);
      this.addCollider(court, slimer2);
    },
   
    update: function() {
      this.collide(); 
    },

    render: function() {
      this.game.pixel.render();
    },

    //
    // Collisions
    //
    
    addCollider: function(body1, body2) {
      if(!this.colliders)
        this.colliders = [];
      this.colliders.push({ body1: body1, body2: body2 });
    },

    collide: function() {
      var self = this;

      if(!self.colliders)
        return;
        
      self.colliders.forEach(function(collider) {
        self.game.physics.arcade.collide(collider.body1, collider.body2);
      });
    },

  };
  
})(window.Slimes = window.Slimes || {});

