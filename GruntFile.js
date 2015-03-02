module.exports = function( grunt ) {

	grunt.initConfig({
		"babel": {
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
				"src": [ "node_modules/grunt-babel/node_modules/babel-core/browser-polyfill.js", "src/**/*.js" ]
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
	grunt.loadNpmTasks("grunt-babel");

	// Default task(s).
	grunt.registerTask("default", [ "concat:dist", "babel:dist" ]);

};