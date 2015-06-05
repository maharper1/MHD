module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    processhtml: {
      dist: {
        options: {
          process: true,
        },
        files: [{
          expand: true,
          cwd: '',
          src: 'index.html',
          dest: 'build/',
          ext: '.html'
        }]
      }
     },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
        files: {
          'build/index.html': 'build/index.html'
        }
      }
    },
    imagemin: {
      png: {
        options: {
          optimizationLevel: 7
        },
        files: [{
          expand: true,
          cwd: 'images',
          src: ['*.png'],
          dest: 'build/images',
          ext: '.png'
        }]
      },
      jpg: {
        options: {
          progressive: true
        },
        files: [{
            expand: true,
            cwd: 'images',
            src: ['*.jpg'],
            dest: 'build/images',
            ext: '.jpg'
          }]
      }
    },
    cssmin: {
      dist: {
          files: [{
            expand: true,
            cwd: 'css',
            src: ['*.css'],
            dest: 'build/css',
            ext: '.min.css'
          }]
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['js/*.js'],
        dest: 'js/combined/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'build/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'js/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        },
        ignores: ['js/data.js']
      }
    }
  });

   grunt.loadNpmTasks('grunt-contrib-imagemin');
   grunt.loadNpmTasks('grunt-contrib-cssmin');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-htmlmin');
   grunt.loadNpmTasks('grunt-processhtml');
   grunt.loadNpmTasks('grunt-changed');

  grunt.registerTask('default',
    ['changed:imagemin', 'changed:cssmin', 'changed:jshint',
     'concat',
     'changed:uglify', 'changed:processhtml', 'changed:htmlmin']);

};