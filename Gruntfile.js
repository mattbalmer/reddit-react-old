module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jade: {
            compile: {
                options: {
                    client: false,
                    pretty: true
                },
                files: [
                    {
                        cwd: 'app/views',
                        src: '**/*.jade',
                        dest: 'public',
                        expand: true,
                        ext: '.html'
                    }
                ]
            }
        },
        watch: {
            jade: {
                files: 'app/**/*.jade',
                tasks: ['jade']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jade');

    grunt.registerTask('compile', ['jade']);
    grunt.registerTask('default', ['compile', 'watch']);
};