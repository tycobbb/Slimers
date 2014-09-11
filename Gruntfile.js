
module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    
    connect: {
      server: {
        options: {
          port: 8080,
          base: './deploy'
        }
      }
    },

    concat: {
      dist: {
        src: [
          "source/lib/**/*.js",
          "source/game/shared/*.js",
          "source/game/**/!(main).js",
          "source/game/main.js"
        ],
        dest: 'deploy/js/<%= pkg.name %>.js'
      }
    },

    watch: {
      files: [ 
        'source/**/*.js'
      ],
      tasks: [ 'concat' ]
    },

  });

  grunt.registerTask('default', [ 'concat', 'connect', 'watch' ]);

};
