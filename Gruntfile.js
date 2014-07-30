module.exports = function(grunt) {

  grunt.initConfig({
    
    pkg : grunt.file.readJSON('package.json'),
    
    clean : ['public/dist/*', 'public/js/templates/compiled_templates.js'],


    sass: {
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          'public/css/garhammar.css': 'public/css/sass/garhammar.scss',
          'public/css/admin.css': 'public/css/sass/admin.scss'
        }
      },
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'public/dist/css/garhammar.min.css': 'public/css/sass/garhammar.scss',
          'public/dist/css/admin.min.css': 'public/css/sass/admin.scss'
        }
      }
    },


    copy: {
      fonts: {
        expand: true,
        src: ['public/fonts/*'],
        dest: 'public/dist/fonts',
        flatten: true,
        filter: 'isFile'
      }
    },

    
    jshint: {
      files: ['public/js/**/*.js', 'server/**/*.js'],
      options: {
        'force'         : true,
        'globalstrict'  : true,
        'node'          : true,
        'validthis'     : true,
        'globals' : {
          'window'      : true,
          'Handlebars'  : true,
          'document'    : true,
          'location'    : true,
          'requirejs'   : true,
          'define'      : true,
          'l'           : true,
          'garhammar'   : true,
          'XMLHttpRequest' : true,
          'FormData'    : true,
          'google'      : false
        },
        ignores : ['public/js/libs/**/*.js', 'public/js/templates/compiled_templates.js']
      }
    },
    

    handlebars: {
      all: {
        files: {
            'public/js/templates/compiled_templates.js': 'server/**/_*.html'
        },
        options: {
          exportAMD: true
        }
      }
    },


    watch: {
      files: ['server/**/*.js', 'server/views/*.html', 'public/css/**/*.scss', 'public/js/**/*.js'],
      tasks: ['handlebars', 'sass']
    },


    requirejs : {
      compile : {
        options : {
           name : 'garhammar',
           mainConfigFile : 'public/js/prod.js',
           out : 'public/dist/js/requirejs.min.js',
           optimize : 'uglify2',
           preserveLicenseComments : false,
           inlineText : true,
           findNestedDependencies : true,
           paths : {
              requireLib : 'libs/requirejs/require'
           },
           include : [
              'requireLib',
              'components/sidebar',
              'components/tabs',
              'components/code/maps/route',
              'components/code/maps/google'
           ]
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-handlebars-compiler');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.registerTask('version-assets', 'version the static assets just created', function() {
      var Version = require("node-version-assets");
      var versionInstance = new Version({
          keepOriginalAndOldVersions : true,
          assets: ['public/dist/css/garhammar.min.css', 'public/dist/css/admin.min.css', 'public/dist/js/requirejs.min.js'],
          grepFiles: ['server/views/site/layouts/index.html', 'server/views/require_conf.html']
      });

      var cb = this.async(); // grunt async callback
      versionInstance.run(cb);
  });
  grunt.registerTask('default', ['clean', 'sass', 'copy', 'jshint', 'handlebars', 'requirejs', 'version-assets']);

};
