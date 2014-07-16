module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        react: {
            compile: {
                files: {
                    'public/js/app.js': 'app/js/**/*.js'
                }
            }
        },
        uglify: {
            compile: {
                options: {
                    wrap: 'reddit'
                },
                files: {
                    'public/js/app.min.js': 'public/js/app.js'
                }
            }
        },
        watch: {
            js: {
                files: 'app/**/*.js',
                tasks: ['react', 'uglify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-react');

    grunt.registerTask('compile', ['react', 'uglify']);
    grunt.registerTask('default', ['compile', 'watch']);
};