module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
  babel: {
    options: {
      sourceMap: false,
      presets: ['env']
    },
    dist: {
      files: {
        "dist/nodetools.js": "./nodetools.js"
      }
    }
  }
  });
  grunt.registerTask('default', ['babel:dist']);
};