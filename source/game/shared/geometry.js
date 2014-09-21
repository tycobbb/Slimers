//
// Geometry -- geometry.js
//

(function(Slimes) {

  //
  // Point
  //

  var Point = Phaser.Point;

  Point.fromAngle = function(angle) {
    return new Phaser.Point(
      Math.cos(angle), 
      Math.sin(angle)
    );  
  };

  Point.scale = function(point, scalar, out) {
    if(out === undefined)
      out = new Point();

    out.x = point.x * scalar;
    out.y = point.y * scalar;

    return out;
  }

  Point.prototype.scale = function(scalar) {
    return this.multiply(scalar, scalar);
  };

  Point.prototype.addPoint = function(point) {
    return this.add(point.x, point.y);
  };

  //
  // Point Proxy
  //

  var Proxy = Phaser.Physics.P2.InversePointProxy;

  Proxy.prototype.setPoint = function(point) {
    this.x = point.x;
    this.y = point.y;  
  };
  
})(window.Slimes = window.Slimes || {});

