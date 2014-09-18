
(function(logger) {

  var levels = {
    ERROR:   1 << 0,
    INFO:    1 << 1,
    DEBUG:   1 << 2,
    VERBOSE: 1 << 3
  };

  var masks = {};

  masks.ERROR   = levels.ERROR;
  masks.INFO    = masks.ERROR | levels.INFO;
  masks.DEBUG   = masks.INFO  | levels.DEBUG;
  masks.VERBOSE = masks.DEBUG | levels.VERBOSE;

  // function generator 
  function logFunction(level) {
    return function(message) {
      if(this.level & level != 0)
        console.log(message);
    };
  };

  //
  // Exports
  //

  // attributes 
  logger.levels = levels;  
  logger.masks  = masks;
  
  // functions 
  logger.error    = logFunction(levels.ERROR);
  logger.info     = logFunction(levels.INFO);
  logger.debug    = logFunction(levels.DEBUG);
  logger.versbose = logFunction(levels.VERBOSE);

})(window.logger = window.logger || {});

