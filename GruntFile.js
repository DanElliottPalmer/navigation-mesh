module.exports = function( grunt ) {

	grunt.initConfig({
		"6to5": {
			"debug": {
				"files": {
					"dist/debug.js": "dist/debug-es6.js"
				}
			},
			"dist": {
				"files": {
					"dist/NavigationMesh.js": "dist/NavigationMesh-es6.js"
				}
			},
			"options": {
				"sourceMap": true
			}
		},
		"concat": {
			"dist": {
				"dest": "dist/NavigationMesh-es6.js",
				"src": [ "src/**/*.js" ]
			},
			"debug": {
				"dest": "dist/debug-es6.js",
				"src": [ "debug/EventEmitter.js", "debug/DisplayObject.js", "debug/**/*.js" ]
			}
		},
		"pkg": grunt.file.readJSON("package.json"),
		"watch": {
			"dist": {
				"files": [ "src/**/*.js" ],
				"options": {
					"interrupt": true,
					"livereload": true
				},
				"tasks": [ "default" ]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-6to5");

	// Default task(s).
	grunt.registerTask("default", [ "concat:dist", "6to5:dist", "concat:debug", "6to5:debug" ]);

};