module.exports = function( grunt ) {

  const browsersOpt = { browsers: [ "last 2 versions", "> 0.5%", "ie 11" ] };

  require( 'load-grunt-tasks' )( grunt );

  grunt.initConfig({
    babel: {
      options: {
        sourceMap: false,
          presets: [ "@babel/preset-env" ]
      },
      dist: {
        files: {
          "dist/nodetools.js": "./nodetools.js"
        }
      }
    }
  });

  grunt.registerTask( 'default', [ 'babel:dist' ] );

};