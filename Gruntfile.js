module.exports = function(grunt) {

  var dimensions = {
    XS  : 260, // 320 - 40 main padding - 20 placeholder padding
    S   : 420, // 480 - 40 main padding - 20 placeholder padding
    M   : 580, // 640 - 40 main padding - 20 placeholder padding
    L   : 900, // 960 - 40 main padding - 20 placeholder padding
    XL  : 1020 // 1080 - 40 main padding - 20 placeholder padding
  };

  grunt.initConfig({
    
    pkg : grunt.file.readJSON('package.json'),
    
    clean : {
      build : [
        'public/dist/*', 
        'public/js/templates/compiled_templates.js'
      ],
      images : [
        'public/img/org/tmp/*'
      ]
    },

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
      },
      images: {
        expand: true,
        src: ['public/img/org/favicon.ico', 'public/img/org/ajax-loader.gif'],
        dest: 'public/img/dist/',
        flatten: true,
        filter: 'isFile'
      }
    },

    image: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'public/img/org', 
          src: ['**/*.{png,jpg,svg}'],
          dest: 'public/img/org/tmp/'
        }]
      },
      prod: {
        files: [{
          expand: true,
          cwd: 'public/img/org/tmp', 
          src: ['**/*.{png,jpg,svg}'],
          dest: 'public/img/org/tmp/'
        }]       
      }
    },

    responsive_images: {
        myTask: {
          options: {
            engine : 'im',
            sizes: [{
              name : 'xs',
              quality : 80,
              width : dimensions.XS
            },
            {
              name : 's',
              quality : 80,
              width : dimensions.S
            },
            {
              name : 'm',
              quality : 80,
              width : dimensions.M
            },
            {
              name : 'l',
              quality : 80,
              width: dimensions.L
            },
            {
              name : 'xl',
              quality : 80,
              width: dimensions.XL
            }]
          },
          files: [{
            expand: true,
            src: ['**.{jpg,png}'],
            cwd: 'public/img/org/tmp/',
            dest: 'public/img/dist/'
          }]
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
          'window'      : false,
          'Handlebars'  : false,
          'document'    : false,
          'location'    : false,
          'requirejs'   : false,
          'define'      : false,
          'l'           : true,
          'garhammar'   : true,
          'XMLHttpRequest' : false,
          'FormData'    : false,
          'google'      : false,
          'templatesName' : false
        },
        ignores : ['public/js/libs/**/*.js', 'public/js/templates/*.js']
      }
    },
    

    handlebars: {
      admin : {
        files: {
          'public/js/templates/compiled_admin_templates.js': ['server/views/admin/**/_*.html', 'server/views/_alert.html', 'server/views/_tooltip_error.html']
        },
        options: {
          exportAMD: true
        }
      },
      site: {
        files: {
          'public/js/templates/compiled_templates.js': ['server/views/site/**/_*.html', 'server/views/_alert.html', 'server/views/_tooltip_error.html']
        },
        options: {
          exportAMD: true
        }
      }
    },


    watch: {
      dev : {
        files: ['server/**/*.js', 'server/views/**/*.html', 'public/css/**/*.scss', 'public/js/**/*.js'],
        tasks: ['handlebars', 'sass']
      },
      prod : {
        files: ['public/img/trigger.js'],
        tasks: ['image:prod', 'responsive_images', 'clean:images']
      }
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
           findNestedDependencies : false,
           paths : {
              requireLib : 'libs/requirejs/require'
           },
          onBuildWrite: function (moduleName, path, contents) {
                if (moduleName === 'components/tabs' || moduleName === 'components/sidebar') {
                  return contents.replace("templatesName", "'templates/templates'");
                }
                return contents;
           },
           include : [
              'requireLib',
              'components/sidebar',
              'components/tabs',
              'components/code/maps/route',
              'components/code/maps/google',
              'components/pics/pics',
              'templates/compiled_templates'
           ]
        }
      },
      admin : {
        options : {
           name : 'garhammar',
           mainConfigFile : 'public/js/admin_conf.js',
           out : 'public/dist/js/requirejs.admin.min.js',
           optimize : 'uglify2',
           preserveLicenseComments : false,
           inlineText : true,
           findNestedDependencies : false,
           paths : {
              requireLib : 'libs/requirejs/require'
           },
          onBuildWrite: function (moduleName, path, contents) {
                if (moduleName === 'components/tabs' || moduleName === 'components/sidebar') {
                  return contents.replace("templatesName", "'templates/admin_templates'");
                }
                return contents;
           },
           include : [
              'requireLib',
              'components/sidebar',
              'components/tabs',
              'components/admin/pics/pic',
              'components/admin/pics/pics',
              'components/admin/pics/upload',
              'templates/compiled_admin_templates'
           ]
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-image');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-handlebars-compiler');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.registerTask('version-assets', 'version the static assets just created', function() {
      var Version = require("node-version-assets");
      var versionInstance = new Version({
          keepOriginalAndOldVersions : true,
          assets: ['public/dist/css/garhammar.min.css', 'public/dist/css/admin.min.css', 'public/dist/js/requirejs.min.js', 'public/dist/js/requirejs.admin.min.js'],
          grepFiles: ['server/views/site/layouts/index.html', 'server/views/require_conf.html', 'server/views/site/layouts/admin.html', 'server/views/admin/require_admin_conf.html']
      });
      var cb = this.async();
      versionInstance.run(cb);
  });
  grunt.registerTask('default', ['clean:build', 'sass', 'copy', 'jshint', 'handlebars', 'requirejs', 'version-assets']);
  grunt.registerTask('images', ['clean:images', 'image:dynamic', 'responsive_images', 'copy:images', 'clean:images']);

};
